from fastapi import  APIRouter, Depends, HTTPException, status
import json 
from app.models.schemas import Machines
from app.logging.logger import AppLogger
import redis
from app.redis_setting.redis_pool import get_redis_client
from typing import List, Union, Literal


logger = AppLogger().get_logger()



router = APIRouter()

# Endpoint para registrar uma nova máquina
@router.post("/machines", tags=["Machine Manage"], status_code=status.HTTP_201_CREATED, response_model=Machines)
def machine_register(machine_create: Machines, redis_client: redis.Redis = Depends(get_redis_client)) -> Machines:
    logger.info(f"Criando uma nova máquina {machine_create.name}")

    # Gerando um identificador único para a máquina
    machine_id = f"machine:{machine_create.serial_number}"

    try:
        # Verificando se a máquina já existe
        if redis_client.exists(machine_id):
            raise HTTPException(status_code=400, detail="Máquina já registrada.")

        # Salvando os dados da máquina
        machine_data = machine_create.model_dump()
        machine_data_json = json.dumps(machine_data)
        redis_client.set(machine_id, machine_data_json)
        redis_client.sadd("machines_list", machine_id)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return machine_create

# Endpoint para obter todas as máquinas registradas
@router.get("/machines", tags=["Machine Manage"], response_model=List[Machines])
def get_machines(redis_client: redis.Redis = Depends(get_redis_client)) -> List[Machines]:
    logger.info("Obtendo todas as máquinas")

    try:
        # Obtendo todas as chaves de máquinas registradas
        machine_keys = redis_client.smembers("machines_list")
        machines = []

        # Iterando pelas chaves para obter os dados de cada máquina
        for key in machine_keys:
            machine_data = redis_client.get(key)
            if machine_data:
                # Convertendo a string JSON em um objeto Machines
                try:
                    machine_data_dict = json.loads(machine_data.decode('utf-8'))
                    if not isinstance(machine_data_dict, dict):
                        raise ValueError(f"Formato inválido de dados: {machine_data_dict}")
                    machines.append(Machines(**machine_data_dict))
                except (json.JSONDecodeError, ValueError) as e:
                    logger.error(f"Erro ao decodificar os dados da máquina: {str(e)}")

        return machines

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para obter uma máquina específica pelo número de série
@router.get("/machines/{serial_number}", tags=["Machine Manage"], response_model=Machines)
def get_machine(serial_number: str, redis_client: redis.Redis = Depends(get_redis_client)) -> Machines:
    logger.info(f"Obtendo máquina com número de série: {serial_number}")

    # Gerar a chave correspondente ao número de série
    machine_id = f"machine:{serial_number}"

    try:
        # Buscar os dados da máquina no Redis
        machine_data = redis_client.get(machine_id)

        # Se a máquina não existir, retornar erro 404
        if not machine_data:
            raise HTTPException(status_code=404, detail="Máquina não encontrada")

        # Decodificar os dados da máquina
        try:
            machine_data_dict = json.loads(machine_data.decode('utf-8'))
            if not isinstance(machine_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {machine_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da máquina: {str(e)}")

        # Criar uma instância do modelo Machines e retornar
        return Machines(**machine_data_dict)

    except (ConnectionError, TimeoutError) as e:
        # Tratar erro de conexão com o Redis
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para atualizar dados de uma máquina
@router.put("/machines/{serial_number}", tags=["Machine Manage"], status_code=status.HTTP_202_ACCEPTED, response_model=Machines)
def update_machine(serial_number: str, machine_update: Machines, redis_client: redis.Redis = Depends(get_redis_client)) -> Machines:
    logger.info(f"Atualizando dados da máquina com número de série: {serial_number}")
    machine_id = f"machine:{serial_number}"

    try:
        # Buscar os dados da máquina no Redis
        machine_data = redis_client.get(machine_id)
        if not machine_data:
            raise HTTPException(status_code=404, detail="Máquina não encontrada")

        # Decodificar os dados existentes da máquina
        try:
            machine_data_dict = json.loads(machine_data.decode('utf-8'))
            if not isinstance(machine_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {machine_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da máquina: {str(e)}")

        # Atualizar os dados da máquina com as informações fornecidas
        machine_data_dict.update(machine_update.model_dump())
        machine_data_json = json.dumps(machine_data_dict)

        # Atualizar os dados da máquina no Redis
        redis_client.set(machine_id, machine_data_json)

        return Machines(**machine_data_dict)

    except (ConnectionError, TimeoutError) as e:
        # Tratar erro de conexão com o Redis
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para remover uma máquina
@router.delete("/machines/{serial_number}", tags=["Machine Manage"], status_code=status.HTTP_204_NO_CONTENT)
def delete_machine(serial_number: str, redis_client: redis.Redis = Depends(get_redis_client)):
    logger.info(f"Removendo máquina com número de série: {serial_number}")
    machine_id = f"machine:{serial_number}"

    try:
        # Buscar os dados da máquina no Redis
        machine_data = redis_client.get(machine_id)
        if not machine_data:
            raise HTTPException(status_code=404, detail="Máquina não encontrada")

        # Remover a máquina do Redis
        redis_client.srem("machines_list", machine_id)
        redis_client.delete(machine_id)

    except (ConnectionError, TimeoutError) as e:
        # Tratar erro de conexão com o Redis
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return None