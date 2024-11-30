from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    FastAPI
)
from .models.schemas import (
    CreatePartsSchema,
    DeletePartsSchema,
    UpdatePartsSchema,
    GetAllPartsSchema,
    GetPartsSchema,
)
import json
from app.logging.logger import AppLogger
from app.redis_setting.redis_pool import get_redis_client
import redis
from typing import (
    Optional,
    List
)

router = APIRouter()
logger = AppLogger().get_logger()


# Endpoint para registrar uma nova parte de reposição
@router.post(
    "/parts",
    tags=["Parts Manager"],
    response_model=CreatePartsSchema,
    status_code=status.HTTP_201_CREATED
)
def post_parts_of_reposition(
    parts_of_reposition: CreatePartsSchema,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> CreatePartsSchema:
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
@router.put(
    "/parts/{code}/entry",
    tags=["Parts Manager"],
    status_code=status.HTTP_202_ACCEPTED,
    response_model=UpdatePartsSchema
)
def entry_parts_on_stock(
    code: str,
    entry_parts_on_stock: UpdatePartsSchema,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> UpdatePartsSchema:
    logger.info(f"Registrando entrada de parte com código: {code}")
    parts_of_reposition_id = f"parts:{code}"

    try:
        parts_of_reposition_data = redis_client.get(parts_of_reposition_id)
        if not parts_of_reposition_data:
            raise HTTPException(status_code=404, detail="Parte não encontrada")

        try:
            parts_of_reposition_data_dict = json.loads(parts_of_reposition_data.decode('utf-8'))
            if not isinstance(parts_of_reposition_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {parts_of_reposition_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da parte: {str(e)}")

        entry_parts_on_stock_data = entry_parts_on_stock.model_dump()
        entry_parts_on_stock_data['entry_date'] = entry_parts_on_stock_data['entry_date'].isoformat()
        parts_of_reposition_data_dict.update(entry_parts_on_stock_data)
        parts_of_reposition_data_json = json.dumps(parts_of_reposition_data_dict)

        redis_client.set(parts_of_reposition_id, parts_of_reposition_data_json)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return entry_parts_on_stock


@router.delete(
    "/parts/{code}",
    tags=["Parts Manager"],
    status_code=status.HTTP_204_NO_CONTENT
)
def exit_parts_on_stock(
    code: str,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> None:
    logger.info(f"Registrando saída de parte com código: {code}")
    parts_id = f"parts:{code}"
    try:
        if not redis_client.exists(parts_id):
            raise HTTPException(status_code=404, detail="Parte não encontrada")

        redis_client.delete(parts_id)
        redis_client.srem("parts_id", parts_id)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")



# Endpoint para obter todas as partes registradas
@router.get(
    "/parts",
    tags=["Parts Manager"],
    response_model=List[GetAllPartsSchema]
)
def get_parts_of_reposition(
    redis_client: redis.Redis = Depends(get_redis_client)
) -> List[GetAllPartsSchema]:
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

                    parts_of_reposition_list.append(GetAllPartsSchema(**parts_of_reposition_data_dict))

                except (json.JSONDecodeError, ValueError) as e:
                    logger.error(f"Erro ao decodificar os dados da parte: {str(e)}")

        return parts_of_reposition_list

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


# Endpoint para obter uma parte de reposição específica pelo código
@router.get(
    "/parts/{code}",
    tags=["Parts Manager"],
    response_model=GetPartsSchema,
    status_code=status.HTTP_200_OK
)
def get_parts_of_reposition_by_code(
    code: str,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> GetPartsSchema:
    logger.info(f"Obtendo parte de reposição com código: {code}")
    parts_of_reposition_id = f"parts:{code}"

    try:
        parts_of_reposition_data = redis_client.get(parts_of_reposition_id)

        if not parts_of_reposition_data:
            raise HTTPException(status_code=404, detail="Parte não encontrada")

        try:
            parts_of_reposition_data_dict = json.loads(parts_of_reposition_data.decode('utf-8'))
            if not isinstance(parts_of_reposition_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {parts_of_reposition_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da parte: {str(e)}")

        return GetPartsSchema(**parts_of_reposition_data_dict)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


def configure(app: FastAPI):
    app.include_router(router)

