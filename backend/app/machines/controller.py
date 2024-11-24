from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    FastAPI,
)
import json
from .models.schemas import (
    CreateMachinesSchema,
    DeleteMachinesSchema,
    GetMachinesSchema,
    GetAllMachinesSchema,
    UpdateMachinesSchema,
)
from app.logging.logger import AppLogger
import redis
from app.redis_setting.redis_pool import get_redis_client
from typing import List
from dependency_injector.wiring import inject

logger = AppLogger().get_logger()
router = APIRouter()

# Endpoint para registrar uma nova máquina
@inject
@router.post(
    "/machines",
    tags=["Machine Manage"],
    status_code=status.HTTP_201_CREATED,
    response_model=CreateMachinesSchema,
)
def machine_register(
    machine_create: CreateMachinesSchema,
    redis_client: redis.Redis = Depends(get_redis_client),
) -> CreateMachinesSchema:
    logger.info(f"Criando uma nova máquina {machine_create.name}")
    machine_id = f"machine:{machine_create.serial_number}"

    try:
        if redis_client.exists(machine_id):
            raise HTTPException(status_code=400, detail="Máquina já registrada.")

        machine_data = machine_create.model_dump()
        machine_data_json = json.dumps(machine_data)
        redis_client.set(machine_id, machine_data_json)
        redis_client.sadd("machines_list", machine_id)
    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return machine_create


# Endpoint para obter todas as máquinas registradas
@inject
@router.get(
    "/machines",
    tags=["Machine Manage"],
    response_model=List[GetAllMachinesSchema],
)
def get_machines(
    redis_client: redis.Redis = Depends(get_redis_client),
) -> List[GetAllMachinesSchema]:
    logger.info("Obtendo todas as máquinas")

    try:
        machine_keys = redis_client.smembers("machines_list")
        machines = []

        for key in machine_keys:
            machine_data = redis_client.get(key)
            if machine_data:
                try:
                    machine_data_dict = json.loads(machine_data.decode("utf-8"))
                    if not isinstance(machine_data_dict, dict):
                        raise ValueError(f"Formato inválido de dados: {machine_data_dict}")
                    machines.append(CreateMachinesSchema(**machine_data_dict))
                except (json.JSONDecodeError, ValueError) as e:
                    logger.error(f"Erro ao decodificar os dados da máquina: {str(e)}")
        return machines
    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


# Endpoint para obter uma máquina específica pelo número de série
@inject
@router.get(
    "/machines/{serial_number}",
    tags=["Machine Manage"],
    response_model=GetMachinesSchema,
)
def get_machine(
    serial_number: str,
    redis_client: redis.Redis = Depends(get_redis_client),
) -> GetMachinesSchema:
    logger.info(f"Obtendo máquina com número de série: {serial_number}")
    machine_id = f"machine:{serial_number}"

    try:
        machine_data = redis_client.get(machine_id)
        if not machine_data:
            raise HTTPException(status_code=404, detail="Máquina não encontrada")

        try:
            machine_data_dict = json.loads(machine_data.decode("utf-8"))
            if not isinstance(machine_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {machine_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da máquina: {str(e)}")
        return CreateMachinesSchema(**machine_data_dict)
    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


# Endpoint para atualizar dados de uma máquina
@inject
@router.put(
    "/machines/{serial_number}",
    tags=["Machine Manage"],
    status_code=status.HTTP_202_ACCEPTED,
    response_model=UpdateMachinesSchema,
)
def update_machine(
    serial_number: str,
    machine_update: UpdateMachinesSchema,
    redis_client: redis.Redis = Depends(get_redis_client),
) -> UpdateMachinesSchema:
    logger.info(f"Atualizando dados da máquina com número de série: {serial_number}")
    machine_id = f"machine:{serial_number}"

    try:
        machine_data = redis_client.get(machine_id)
        if not machine_data:
            raise HTTPException(status_code=404, detail="Máquina não encontrada")

        try:
            machine_data_dict = json.loads(machine_data.decode("utf-8"))
            if not isinstance(machine_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {machine_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da máquina: {str(e)}")

        machine_data_dict.update(machine_update.model_dump())
        machine_data_json = json.dumps(machine_data_dict)
        redis_client.set(machine_id, machine_data_json)
        return CreateMachinesSchema(**machine_data_dict)
    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


# Endpoint para excluir uma máquina
@router.delete(
    "/machines/{serial_number}",
    tags=["Machine Manage"],
    status_code=status.HTTP_200_OK,
    response_model=DeleteMachinesSchema,
)
def delete_machine(
    serial_number: str,
    redis_client: redis.Redis = Depends(get_redis_client),
) -> DeleteMachinesSchema:
    logger.info(f"Removendo máquina com número de série: {serial_number}")
    machine_id = f"machine:{serial_number}"

    try:
        machine_data = redis_client.get(machine_id)
        if not machine_data:
            raise HTTPException(status_code=404, detail="Máquina não encontrada")

        redis_client.srem("machines_list", machine_id)
        redis_client.delete(machine_id)
    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return DeleteMachinesSchema(machine_id=serial_number)


# Configuração do aplicativo
def configure(app: FastAPI):
    app.include_router(router)
