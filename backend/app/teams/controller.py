from fastapi import (
    APIRouter,
    HTTPException,
    status,
    Depends,
    FastAPI
)
from app.logging.logger import AppLogger
from .models.schemas import (
    CreateTeamsSchema,
    DeleteTeamsSchema,
    GetAllTeamsSchema,
    GetTeamsSchema,
    UpdateTeamsSchema
)
from app.redis_setting.redis_pool import get_redis_client
import redis
from redis import *
import json
from typing import (
    List
)

logger = AppLogger().get_logger()

router = APIRouter()


# Endpoint para registrar uma nova equipe de manutenção
@router.post(
    "/teams",
    tags=["Teams Manager"],
    response_model=GetTeamsSchema,
    status_code=status.HTTP_201_CREATED
)
def register_teams_on_maintenance(
    register_teams_on_maintenance: CreateTeamsSchema,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> GetTeamsSchema:
    logger.info("Registrando nova equipe de manutenção")
    team_id = f"team:{register_teams_on_maintenance.name}"

    try:
        # Verificando se a equipe já existe
        if redis_client.exists(team_id):
            raise HTTPException(status_code=400, detail="Equipe já registrada.")

        # Salvando os dados da equipe
        team_data = register_teams_on_maintenance.dict()
        team_data['team_id'] = team_id
        team_data_json = json.dumps(team_data)
        redis_client.set(team_id, team_data_json)
        redis_client.sadd("teams_list", team_id)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return GetTeamsSchema(team_id=team_id)



# Endpoint para obter todas as equipes registradas

@router.get(
    "/teams",
    tags=["Teams Manager"],
    response_model=List[GetAllTeamsSchema]
)
def get_teams(
    redis_client: redis.Redis = Depends(get_redis_client)
) -> List[GetAllTeamsSchema]:
    logger.info("Obtendo todas as equipes de manutenção")

    try:
        team_keys = redis_client.smembers("teams_list")
        teams_list = []

        # Iterando pelas chaves para obter os dados de cada equipe
        for key in team_keys:
            team_data = redis_client.get(key)
            if team_data:
                try:
                    team_data_dict = json.loads(team_data.decode('utf-8'))
                    if not isinstance(team_data_dict, dict):
                        raise ValueError(f"Formato inválido de dados: {team_data_dict}")

                    team_data_dict['team_id'] = key.decode('utf-8')
                    teams_list.append(GetAllTeamsSchema(**team_data_dict))

                except (json.JSONDecodeError, ValueError) as e:
                    logger.error(f"Erro ao decodificar os dados da equipe: {str(e)}")

        return teams_list

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


# Endpoint para obter uma equipe específica pelo nome
@router.get(
    "/teams/{team_name}",
    tags=["Teams Manager"],
    response_model=GetTeamsSchema
)
def get_team_by_name(
    team_name: str,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> GetTeamsSchema:
    logger.info(f"Obtendo equipe com nome: {team_name}")
    team_id = f"team:{team_name}"

    try:
        # Buscar os dados da equipe no Redis
        team_data = redis_client.get(team_id)

        if not team_data:
            raise HTTPException(status_code=404, detail="Equipe não encontrada")

        # Decodificar os dados da equipe
        try:
            team_data_dict = json.loads(team_data.decode('utf-8'))
            if not isinstance(team_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {team_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da equipe: {str(e)}")

        return GetTeamsSchema(team_id=team_id)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


# Endpoint para atualizar dados de uma equipe
@router.put(
    "/teams/{team_name}",
    tags=["Teams Manager"],
    status_code=status.HTTP_202_ACCEPTED,
    response_model=UpdateTeamsSchema
)
def update_team(
    team_name: str,
    team_update: UpdateTeamsSchema,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> UpdateTeamsSchema:
    logger.info(f"Atualizando dados da equipe com nome: {team_name}")
    team_id = f"team:{team_name}"

    try:
        # Buscar os dados da equipe no Redis
        team_data = redis_client.get(team_id)
        if not team_data:
            raise HTTPException(status_code=404, detail="Equipe não encontrada")

        # Decodificar os dados existentes da equipe
        try:
            team_data_dict = json.loads(team_data.decode('utf-8'))
            if not isinstance(team_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {team_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados da equipe: {str(e)}")

        # Atualizar os dados da equipe com as informações fornecidas
        team_data_dict.update(team_update.dict())
        team_data_json = json.dumps(team_data_dict)

        # Atualizar os dados da equipe no Redis
        redis_client.set(team_id, team_data_json)

        return UpdateTeamsSchema(**team_data_dict)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


# Endpoint para remover uma equipe
@router.delete(
    "/teams/{team_name}",
    tags=["Teams Manager"]
)
def delete_team(
    team_name: str,
    redis_client: redis.Redis = Depends(get_redis_client)
):
    logger.info(f"Removendo equipe com nome: {team_name}")
    team_id = f"team:{team_name}"

    try:
        # Buscar os dados da equipe no Redis
        team_data = redis_client.get(team_id)
        if not team_data:
            raise HTTPException(status_code=404, detail="Equipe não encontrada")

        # Remover a equipe do Redis
        redis_client.srem("teams_list", team_id)
        redis_client.delete(team_id)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


# Função para configurar o roteador no aplicativo FastAPI
def configure(
    app: FastAPI
):
    app.include_router(router)


