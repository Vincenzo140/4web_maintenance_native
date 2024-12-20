from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from .models.schemas import (
    CreateMaintenanceSchema,
    DeleteMaintenanceSchema,
    GetMaintenanceSchema,
    GetAllMaintenanceSchema,
    UpdateMaintenanceSchema
)
from app.logging.logger import AppLogger
import json
from typing import Optional, List
from app.redis_setting.redis_pool import get_redis_client
import redis

logger = AppLogger().get_logger()
router = APIRouter()

@router.post(
    "/maintenance",
    tags=["Maintenance Manage"],
    status_code=status.HTTP_201_CREATED,
    response_model=CreateMaintenanceSchema
)
def maintenance_register(
    maintenance_create: CreateMaintenanceSchema,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> CreateMaintenanceSchema:
    logger.info(f"Criando uma nova manutenção {maintenance_create.maintenance_register_id}")

    maintenance_id = f"maintenance:{maintenance_create.maintenance_register_id}"

    try:
        if redis_client.exists(maintenance_id):
            raise HTTPException(status_code=400, detail="Manutenção já registrada.")

        maintenance_data = maintenance_create.dict()
        maintenance_data['maintenance_register_id'] = str(maintenance_create.maintenance_register_id)
        maintenance_data['request_date'] = maintenance_data['request_date'].isoformat()

        team_id = maintenance_create.assigned_team_id
        if not redis_client.exists(team_id):
            raise HTTPException(status_code=400, detail="Equipe atribuída não encontrada.")

        maintenance_data_json = json.dumps(maintenance_data)
        redis_client.set(maintenance_id, maintenance_data_json)
        redis_client.sadd("maintenance_list", maintenance_id)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return maintenance_create


@router.get(
    "/maintenance",
    tags=["Maintenance Manage"],
    response_model=List[GetAllMaintenanceSchema]
)
def get_maintenance(
    machine_id: Optional[str] = None,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> List[GetAllMaintenanceSchema]:
    logger.info(f"Obtendo todas as manutenções para a máquina: {machine_id}")

    try:
        maintenance_keys = redis_client.smembers("maintenance_list")
        maintenance_list = []

        for key in maintenance_keys:
            maintenance_data = redis_client.get(key)
            if maintenance_data:
                try:
                    maintenance_data_dict = json.loads(maintenance_data.decode('utf-8'))
                    maintenance_data_dict['maintenance_register_id'] = str(maintenance_data_dict.get('maintenance_register_id', ''))

                    maintenance_obj = GetAllMaintenanceSchema(**maintenance_data_dict)
                    if machine_id is None or maintenance_obj.machine_id == machine_id:
                        maintenance_list.append(maintenance_obj)

                except (json.JSONDecodeError, ValueError) as e:
                    logger.error(f"Erro ao decodificar os dados da manutenção: {str(e)}", exc_info=True)

        return maintenance_list

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para obter uma manutenção específica pelo número de registro
@router.get(
    "/maintenance/{maintenance_register_id}",
    tags=["Maintenance Manage"],
    response_model=GetMaintenanceSchema
)
def get_maintenance_by_id(
    maintenance_register_id: str,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> GetMaintenanceSchema:
    logger.info(f"Obtendo manutenção com número de registro: {maintenance_register_id}")
    maintenance_id = f"maintenance:{maintenance_register_id}"

    try:
        maintenance_data = redis_client.get(maintenance_id)
        if not maintenance_data:
            raise HTTPException(status_code=404, detail="Manutenção não encontrada")

        try:
            maintenance_data_dict = json.loads(maintenance_data.decode('utf-8'))
            if not isinstance(maintenance_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {maintenance_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da manutenção: {str(e)}")

        return GetMaintenanceSchema(**maintenance_data_dict)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para atualizar dados de uma manutenção
@router.put(
    "/maintenance/{maintenance_register_id}",
    tags=["Maintenance Manage"],
    status_code=status.HTTP_202_ACCEPTED,
    response_model=UpdateMaintenanceSchema
)
def update_maintenance(
    maintenance_register_id: str,
    maintenance_update: UpdateMaintenanceSchema,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> UpdateMaintenanceSchema:
    logger.info(f"Atualizando dados da manutenção com número de registro: {maintenance_register_id}")
    maintenance_id = f"maintenance:{maintenance_register_id}"

    try:
        maintenance_data = redis_client.get(maintenance_id)
        if not maintenance_data:
            raise HTTPException(status_code=404, detail="Manutenção não encontrada")

        try:
            maintenance_data_dict = json.loads(maintenance_data.decode('utf-8'))
            if not isinstance(maintenance_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {maintenance_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da manutenção: {str(e)}")

        if maintenance_update.assigned_team_id:
            team_id = maintenance_update.assigned_team_id
            if not redis_client.exists(team_id):
                raise HTTPException(status_code=400, detail="Equipe atribuída não encontrada.")
        
        maintenance_data_dict.update(maintenance_update.dict(exclude_unset=True))
        if maintenance_data_dict.get('request_date'):
            maintenance_data_dict['request_date'] = maintenance_data_dict['request_date'].isoformat()
        maintenance_data_json = json.dumps(maintenance_data_dict)

        redis_client.set(maintenance_id, maintenance_data_json)

        return UpdateMaintenanceSchema(**maintenance_data_dict)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para remover uma manutenção
@router.delete(
    "/maintenance/{maintenance_register_id}",
    tags=["Maintenance Manage"],
    response_model=DeleteMaintenanceSchema,
    status_code=status.HTTP_200_OK
)
def delete_maintenance(
    maintenance_register_id: str,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> DeleteMaintenanceSchema:
    logger.info(f"Removendo manutenção com número de registro: {maintenance_register_id}")
    maintenance_id = f"maintenance:{maintenance_register_id}"

    try:
        maintenance_data = redis_client.get(maintenance_id)
        if not maintenance_data:
            raise HTTPException(status_code=404, detail="Manutenção não encontrada")

        redis_client.srem("maintenance_list", maintenance_id)
        redis_client.delete(maintenance_id)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return DeleteMaintenanceSchema(maintenance_register_id=maintenance_register_id)

# Configuração do FastAPI
def configure(app: FastAPI):
    app.include_router(router)
