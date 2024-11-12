from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas import PostPartsOfReposition, EntryPartsOnStock
import json
from app.logging.logger import AppLogger
from app.redis_setting.redis_pool import get_redis_client
import redis
from app.models.schemas import PostPartsOfReposition, RegisterBackOffParts
from typing import Optional, List

router = APIRouter()

logger = AppLogger().get_logger()


# Endpoint para registrar uma nova parte de reposição
@router.post("/parts", tags=["Parts Manager"], response_model=PostPartsOfReposition, status_code=status.HTTP_201_CREATED)
def post_parts_of_reposition(parts_of_reposition: PostPartsOfReposition, redis_client: redis.Redis = Depends(get_redis_client)) -> PostPartsOfReposition:
    logger.info(f"Criando uma nova parte de reposição {parts_of_reposition.name}")
    parts_of_reposition_id = f"parts:{parts_of_reposition.code}"

    try:
        if redis_client.exists(parts_of_reposition_id):
            raise HTTPException(status_code=400, detail="Parte já registrada.")

        parts_of_reposition_data = parts_of_reposition.model_dump()
        parts_of_reposition_data_json = json.dumps(parts_of_reposition_data)
        redis_client.set(parts_of_reposition_id, parts_of_reposition_data_json)
        redis_client.sadd("parts_list", parts_of_reposition_id)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return parts_of_reposition

# Endpoint para registrar entrada de partes no estoque
@router.post("/parts/{code}/entry", tags=["Parts Manager"], status_code=status.HTTP_201_CREATED, response_model=EntryPartsOnStock)
def entry_parts_on_stock(code: str, entry_parts_on_stock: EntryPartsOnStock, redis_client: redis.Redis = Depends(get_redis_client)) -> EntryPartsOnStock:
    logger.info(f"Registrando entrada de parte com código: {code}")

    parts_of_reposition_id = f"parts:{code}"

    try:
        # Buscar os dados da parte no Redis
        parts_of_reposition_data = redis_client.get(parts_of_reposition_id)
        if not parts_of_reposition_data:
            raise HTTPException(status_code=404, detail="Parte não encontrada")

        # Decodificar os dados existentes
        try:
            parts_of_reposition_data_dict = json.loads(parts_of_reposition_data.decode('utf-8'))
            if not isinstance(parts_of_reposition_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {parts_of_reposition_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da parte: {str(e)}")

        # Atualizar os dados da parte com a nova entrada
        entry_parts_on_stock_data = entry_parts_on_stock.model_dump()
        entry_parts_on_stock_data['entry_date'] = entry_parts_on_stock_data['entry_date'].isoformat()
        parts_of_reposition_data_dict.update(entry_parts_on_stock_data)
        parts_of_reposition_data_json = json.dumps(parts_of_reposition_data_dict)

        # Atualizar os dados da parte no Redis
        redis_client.set(parts_of_reposition_id, parts_of_reposition_data_json)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return entry_parts_on_stock

# Endpoint para registrar saída de partes no estoque
@router.post("/parts/{code}/exit", tags=["Parts Manager"], status_code=status.HTTP_201_CREATED, response_model=RegisterBackOffParts)
def exit_parts_on_stock(code: str, register_back_off_parts: RegisterBackOffParts, redis_client: redis.Redis = Depends(get_redis_client)) -> RegisterBackOffParts:
    logger.info(f"Registrando saída de parte com código: {code}")

    parts_of_reposition_id = f"parts:{code}"

    try:
        # Buscar os dados da parte no Redis
        parts_of_reposition_data = redis_client.get(parts_of_reposition_id)
        if not parts_of_reposition_data:
            raise HTTPException(status_code=404, detail="Parte não encontrada")

        # Decodificar os dados existentes
        try:
            parts_of_reposition_data_dict = json.loads(parts_of_reposition_data.decode('utf-8'))
            if not isinstance(parts_of_reposition_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {parts_of_reposition_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da parte: {str(e)}")

        # Atualizar os dados da parte com a nova saída
        register_back_off_parts_data = register_back_off_parts.model_dump()
        register_back_off_parts_data['exit_date'] = register_back_off_parts_data['exit_date'].isoformat()
        parts_of_reposition_data_dict.update(register_back_off_parts_data)
        parts_of_reposition_data_json = json.dumps(parts_of_reposition_data_dict)

        # Atualizar os dados da parte no Redis
        redis_client.set(parts_of_reposition_id, parts_of_reposition_data_json)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return register_back_off_parts

# Endpoint para obter todas as partes registradas
@router.get("/parts", tags=["Parts Manager"], response_model=List[PostPartsOfReposition])
def get_parts_of_reposition(redis_client: redis.Redis = Depends(get_redis_client)) -> List[PostPartsOfReposition]:
    logger.info("Obtendo todas as partes de reposição")

    try:
        parts_of_reposition_keys = redis_client.smembers("parts_list")
        parts_of_reposition_list = []

        for key in parts_of_reposition_keys:
            parts_of_reposition_data = redis_client.get(key)
            if parts_of_reposition_data:
                try:
                    parts_of_reposition_data_dict = json.loads(parts_of_reposition_data.decode('utf-8'))
                    if not isinstance(parts_of_reposition_data_dict, dict):
                        raise ValueError(f"Formato inválido de dados: {parts_of_reposition_data_dict}")

                    parts_of_reposition_list.append(PostPartsOfReposition(**parts_of_reposition_data_dict))

                except (json.JSONDecodeError, ValueError) as e:
                    logger.error(f"Erro ao decodificar os dados da parte: {str(e)}")

        return parts_of_reposition_list

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para obter uma parte de reposição específica pelo código
@router.get("/parts/{code}", tags=["Parts Manager"], response_model=PostPartsOfReposition, status_code=status.HTTP_200_OK)
def get_parts_of_reposition_by_code(code: str, redis_client: redis.Redis = Depends(get_redis_client)) -> PostPartsOfReposition:
    logger.info(f"Obtendo parte de reposição com código: {code}")

    parts_of_reposition_id = f"parts:{code}"

    try:
        parts_of_reposition_data = redis_client.get(parts_of_reposition_id)

        if not parts_of_reposition_data:
            raise HTTPException(status_code=404, detail="Parte não encontrada")

        # Decodificar os dados da parte
        try:
            parts_of_reposition_data_dict = json.loads(parts_of_reposition_data.decode('utf-8'))
            if not isinstance(parts_of_reposition_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {parts_of_reposition_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da parte: {str(e)}")

        return PostPartsOfReposition(**parts_of_reposition_data_dict)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")