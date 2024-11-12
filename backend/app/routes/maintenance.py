from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from app.models.schemas import Maintenance
from app.logging.logger import AppLogger
import json
from typing import Optional, List
from app.redis_setting.redis_pool import  get_redis_client
import redis

logger = AppLogger().get_logger()


router = APIRouter()

# Endpoint para registrar uma nova manutenção
@router.post("/maintenance", tags=["Maintenance Manage"], status_code=status.HTTP_201_CREATED, response_model=Maintenance)
def maintenance_register(maintenance_create: Maintenance, redis_client: redis.Redis = Depends(get_redis_client)) -> Maintenance:
    logger.info(f"Criando uma nova manutenção {maintenance_create.maintenance_register_id}")

    maintenance_id = f"maintenance:{maintenance_create.maintenance_register_id}"

    try:
        # Verificando se a manutenção já existe
        if redis_client.exists(maintenance_id):
            raise HTTPException(status_code=400, detail="Manutenção já registrada.")

        # Salvando os dados da manutenção
        maintenance_data = maintenance_create.model_dump()
        maintenance_data['request_date'] = maintenance_data['request_date'].isoformat()
        maintenance_data_json = json.dumps(maintenance_data)
        redis_client.set(maintenance_id, maintenance_data_json)
        redis_client.sadd("maintenance_list", maintenance_id)

    except (ConnectionError, TimeoutError) as e:
        # Tratar erro de conexão com o Redis
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return maintenance_create

# Endpoint para obter todas as manutenções registradas, com possibilidade de filtrar por máquina
@router.get("/maintenance", tags=["Maintenance Manage"], response_model=List[Maintenance])
def get_maintenance(machine_id: Optional[str] = None, redis_client: redis.Redis = Depends(get_redis_client)) -> List[Maintenance]:
    logger.info(f"Obtendo todas as manutenções para a máquina: {machine_id}")

    try:
        # Obtendo todas as chaves de manutenções registradas
        maintenance_keys = redis_client.smembers("maintenance_list")
        maintenance_list = []

        # Iterando pelas chaves para obter os dados de cada manutenção
        for key in maintenance_keys:
            maintenance_data = redis_client.get(key)
            if maintenance_data:
                try:
                    maintenance_data_dict = json.loads(maintenance_data.decode('utf-8'))
                    if not isinstance(maintenance_data_dict, dict):
                        raise ValueError(f"Formato inválido de dados: {maintenance_data_dict}")

                    maintenance_obj = Maintenance(**maintenance_data_dict)
                    if machine_id is None or maintenance_obj.machine_id == machine_id:
                        maintenance_list.append(maintenance_obj)

                except (json.JSONDecodeError, ValueError) as e:
                    logger.error(f"Erro ao decodificar os dados da manutenção: {str(e)}")

        return maintenance_list

    except (ConnectionError, TimeoutError) as e:
        # Tratar erro de conexão com o Redis
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para obter uma manutenção específica pelo número de registro
@router.get("/maintenance/{maintenance_register_id}", tags=["Maintenance Manage"], response_model=Maintenance)
def get_maintenance_by_id(maintenance_register_id: str, redis_client: redis.Redis = Depends(get_redis_client)) -> Maintenance:
    logger.info(f"Obtendo manutenção com número de registro: {maintenance_register_id}")
    maintenance_id = f"maintenance:{maintenance_register_id}"

    try:
        # Buscar os dados da manutenção no Redis
        maintenance_data = redis_client.get(maintenance_id)

        if not maintenance_data:
            raise HTTPException(status_code=404, detail="Manutenção não encontrada")

        # Decodificar os dados da manutenção
        try:
            maintenance_data_dict = json.loads(maintenance_data.decode('utf-8'))
            if not isinstance(maintenance_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {maintenance_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da manutenção: {str(e)}")

        return Maintenance(**maintenance_data_dict)

    except (ConnectionError, TimeoutError) as e:
        # Tratar erro de conexão com o Redis
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para atualizar dados de uma manutenção
@router.put("/maintenance/{maintenance_register_id}", tags=["Maintenance Manage"], status_code=status.HTTP_202_ACCEPTED, response_model=Maintenance)
def update_maintenance(maintenance_register_id: str, maintenance_update: Maintenance, redis_client: redis.Redis = Depends(get_redis_client)) -> Maintenance:
    logger.info(f"Atualizando dados da manutenção com número de registro: {maintenance_register_id}")
    maintenance_id = f"maintenance:{maintenance_register_id}"

    try:
        # Buscar os dados da manutenção no Redis
        maintenance_data = redis_client.get(maintenance_id)
        if not maintenance_data:
            raise HTTPException(status_code=404, detail="Manutenção não encontrada")

        # Decodificar os dados existentes da manutenção
        try:
            maintenance_data_dict = json.loads(maintenance_data.decode('utf-8'))
            if not isinstance(maintenance_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {maintenance_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da manutenção: {str(e)}")

        # Atualizar os dados da manutenção com as informações fornecidas
        maintenance_data_dict.update(maintenance_update.model_dump())
        maintenance_data_dict['request_date'] = maintenance_data_dict['request_date'].isoformat()
        maintenance_data_json = json.dumps(maintenance_data_dict)

        # Atualizar os dados da manutenção no Redis
        redis_client.set(maintenance_id, maintenance_data_json)

        return Maintenance(**maintenance_data_dict)

    except (ConnectionError, TimeoutError) as e:
        # Tratar erro de conexão com o Redis
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para remover uma manutenção
@router.delete("/maintenance/{maintenance_register_id}", tags=["Maintenance Manage"], status_code=status.HTTP_204_NO_CONTENT)
def delete_maintenance(maintenance_register_id: str, redis_client: redis.Redis = Depends(get_redis_client)):
    logger.info(f"Removendo manutenção com número de registro: {maintenance_register_id}")
    maintenance_id = f"maintenance:{maintenance_register_id}"

    try:
        # Buscar os dados da manutenção no Redis
        maintenance_data = redis_client.get(maintenance_id)
        if not maintenance_data:
            raise HTTPException(status_code=404, detail="Manutenção não encontrada")

        # Remover a manutenção do Redis
        redis_client.srem("maintenance_list", maintenance_id)
        redis_client.delete(maintenance_id)

    except (ConnectionError, TimeoutError) as e:
        # Tratar erro de conexão com o Redis
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return None
