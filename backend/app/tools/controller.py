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
from typing import List

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
    logger.info(f"Criando uma nova parte de reposição: {parts_of_reposition.name}")
    parts_id = f"parts:{parts_of_reposition.code}"

    if redis_client.exists(parts_id):
        raise HTTPException(status_code=400, detail="Parte já registrada.")

    try:
        parts_data_json = json.dumps(parts_of_reposition.dict())
        redis_client.set(parts_id, parts_data_json)
        redis_client.sadd("parts_list", parts_id)
    except (ConnectionError, TimeoutError) as e:
        logger.error(f"Erro ao conectar ao Redis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return parts_of_reposition


# Endpoint para atualizar uma parte existente
@router.put(
    "/parts/{code}",
    tags=["Parts Manager"],
    status_code=status.HTTP_202_ACCEPTED,
    response_model=UpdatePartsSchema
)
def update_parts_of_reposition(
    code: str,
    updated_part: UpdatePartsSchema,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> UpdatePartsSchema:
    logger.info(f"Atualizando parte de reposição com código: {code}")
    parts_id = f"parts:{code}"

    if not redis_client.exists(parts_id):
        raise HTTPException(status_code=404, detail="Parte não encontrada.")

    try:
        # Obtém os dados existentes e atualiza com os novos valores
        existing_data = json.loads(redis_client.get(parts_id).decode("utf-8"))
        updated_data = updated_part.dict(exclude_unset=True)  # Atualiza apenas os campos enviados
        existing_data.update(updated_data)
        redis_client.set(parts_id, json.dumps(existing_data))
    except (json.JSONDecodeError, ConnectionError, TimeoutError) as e:
        logger.error(f"Erro ao atualizar parte: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

    return UpdatePartsSchema(**existing_data)


# Endpoint para deletar uma parte de reposição
@router.delete(
    "/parts/{code}",
    tags=["Parts Manager"],
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_parts_of_reposition(
    code: str,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> None:
    logger.info(f"Deletando parte de reposição com código: {code}")
    parts_id = f"parts:{code}"

    if not redis_client.exists(parts_id):
        raise HTTPException(status_code=404, detail="Parte não encontrada.")

    try:
        redis_client.delete(parts_id)
        redis_client.srem("parts_list", parts_id)
    except (ConnectionError, TimeoutError) as e:
        logger.error(f"Erro ao conectar ao Redis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


# Endpoint para obter todas as partes registradas
@router.get(
    "/parts",
    tags=["Parts Manager"],
    response_model=List[GetAllPartsSchema]
)
def get_all_parts(
    redis_client: redis.Redis = Depends(get_redis_client)
) -> List[GetAllPartsSchema]:
    logger.info("Obtendo todas as partes de reposição")

    try:
        parts_keys = redis_client.smembers("parts_list")
        parts_list = []

        for key in parts_keys:
            part_data = redis_client.get(key)
            if part_data:
                parts_list.append(GetAllPartsSchema(**json.loads(part_data.decode("utf-8"))))
    except (ConnectionError, TimeoutError) as e:
        logger.error(f"Erro ao conectar ao Redis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return parts_list


# Endpoint para obter uma parte específica pelo código
@router.get(
    "/parts/{code}",
    tags=["Parts Manager"],
    response_model=GetPartsSchema,
    status_code=status.HTTP_200_OK
)
def get_part_by_code(
    code: str,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> GetPartsSchema:
    logger.info(f"Obtendo parte de reposição com código: {code}")
    parts_id = f"parts:{code}"

    try:
        part_data = redis_client.get(parts_id)
        if not part_data:
            raise HTTPException(status_code=404, detail="Parte não encontrada.")

        return GetPartsSchema(**json.loads(part_data.decode("utf-8")))
    except (ConnectionError, TimeoutError, json.JSONDecodeError) as e:
        logger.error(f"Erro ao obter parte: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


def configure(app: FastAPI):
    app.include_router(router)
