from fastapi import APIRouter, HTTPException, status, Depends
from app.logging.logger import AppLogger
from app.models.schemas import Teams
from app.redis_setting.redis_pool import get_redis_client
import redis
import json
from typing import List

logger = AppLogger().get_logger()

router  = APIRouter()


# Endpoint para registrar uma nova equipe de manutenção
@router.post("/teams", tags=["Teams Manager"], response_model=Teams, status_code=status.HTTP_201_CREATED)
def register_teams_on_maintenance(register_teams_on_maintenance: Teams, redis_client: redis.Redis = Depends(get_redis_client)) -> Teams:
    logger.info("Registrando nova equipe de manutenção")
    team_id = f"team:{register_teams_on_maintenance.name}"

    try:
        # Verificando se a equipe já existe
        if redis_client.exists(team_id):
            raise HTTPException(status_code=400, detail="Equipe já registrada.")

        # Salvando os dados da equipe
        team_data = register_teams_on_maintenance.model_dump()
        team_data_json = json.dumps(team_data)
        redis_client.set(team_id, team_data_json)
        redis_client.sadd("teams_list", team_id)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return register_teams_on_maintenance

# Endpoint para obter todas as equipes registradas
@router.get("/teams", tags=["Teams Manager"], response_model=List[Teams])
def get_teams(redis_client: redis.Redis = Depends(get_redis_client)) -> List[Teams]:
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

                    teams_list.append(Teams(**team_data_dict))

                except (json.JSONDecodeError, ValueError) as e:
                    logger.error(f"Erro ao decodificar os dados da equipe: {str(e)}")

        return teams_list

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para obter uma equipe específica pelo nome
@router.get("/teams/{team_name}", tags=["Teams Manager"], response_model=Teams)
def get_team_by_name(team_name: str, redis_client: redis.Redis = Depends(get_redis_client)) -> Teams:
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

        return Teams(**team_data_dict)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para atualizar dados de uma equipe
@router.put("/teams/{team_name}", tags=["Teams Manager"], status_code=status.HTTP_202_ACCEPTED, response_model=Teams)
def update_team(team_name: str, team_update: Teams, redis_client: redis.Redis = Depends(get_redis_client)) -> Teams:
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
        team_data_dict.update(team_update.model_dump())
        team_data_json = json.dumps(team_data_dict)

        # Atualizar os dados da equipe no Redis
        redis_client.set(team_id, team_data_json)

        return Teams(**team_data_dict)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para remover uma equipe
@router.delete("/teams/{team_name}", tags=["Teams Manager"], status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_name: str, redis_client: redis.Redis = Depends(get_redis_client)):
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

    return None