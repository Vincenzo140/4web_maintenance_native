from app.redis_setting.redis_pool import (
    redis_client
)
from app.auther.auth import (
    verify_password,
    SECRET_KEY,
    ALGORITHM,
    oauth2_scheme,
    create_access_token,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
import json
from fastapi import (
    Depends,
    HTTPException,
    status,
    APIRouter
)
from fastapi.security import (
    OAuth2PasswordRequestForm
)
from jose import (
    JWTError,
    jwt
)
from app.logging.logger import AppLogger
from .models.schemas import (
    TokenData,
    CreateUserSchema,
    LoginUserSchema,
    ManageUsersPermissions,
    Token
)
from datetime import (
    datetime,
    timedelta
)
from app.redis_setting.redis_pool import (
    redis_client,
    get_redis_client
)
import redis
from fastapi import (
    APIRouter,
    FastAPI
)


router = APIRouter()

logger = AppLogger().get_logger()


# Função para obter o usuário
def get_user(username: str):
    user_id = f"user:{username}"
    user_data = redis_client.get(user_id)
    if user_data:
        return json.loads(user_data.decode('utf-8'))
    return None


# Função para autenticar o usuário
def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user


# Função para obter o usuário atual
def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


@router.post(
    "/users",
    tags=["User Management"],
    status_code=status.HTTP_201_CREATED,
    response_model=CreateUserSchema
)
def create_user(
    user: CreateUserSchema,
    redis_client: redis.Redis = Depends(get_redis_client)
) -> CreateUserSchema:
    logger.info(f"Criando novo usuário: {user.username}")
    user_id = f"user:{user.username}"

    try:
        # Verificando se o usuário já existe
        if redis_client.exists(user_id):
            raise HTTPException(status_code=400, detail="Usuário já registrado.")

        # Criptografando a senha e salvando os dados do usuário
        user_data = user.dict()
        user_data["password"] = get_password_hash(user.password)
        user_data_json = json.dumps(user_data)
        redis_client.set(user_id, user_data_json)
        redis_client.sadd("users_list", user_id)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return user


# Endpoint para fazer login e obter o token de acesso
@router.post(
    "/token",
    tags=["User Management"],
    response_model=Token
)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    redis_client: redis.Redis = Depends(get_redis_client)
) -> Token:
    logger.info(f"Usuário tentando fazer login: {form_data.username}")
    user_id = f"user:{form_data.username}"

    try:
        user_data = redis_client.get(user_id)
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário ou senha incorretos",
                headers={"WWW-Authenticate": "Bearer"},
            )

        try:
            user = json.loads(user_data.decode('utf-8'))
            if not isinstance(user, dict):
                raise ValueError(f"Formato inválido de dados: {user}")

            if not verify_password(form_data.password, user["password"]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Usuário ou senha incorretos",
                    headers={"WWW-Authenticate": "Bearer"},
                )

        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados do usuário: {str(e)}")

        # Gerar o token de acesso
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["username"]}, expires_delta=access_token_expires
        )

        return {"access_token": access_token, "token_type": "bearer"}

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


# Endpoint para gerenciar permissões de usuário
@router.put(
    "/users/{username}/permissions",
    tags=["User Management"],
    status_code=status.HTTP_202_ACCEPTED,
    response_model=ManageUsersPermissions
)
def manage_user_permissions(
    username: str,
    permissions: ManageUsersPermissions,
    redis_client: redis.Redis = Depends(get_redis_client),
    current_user: dict = Depends(get_current_user)
) -> ManageUsersPermissions:
    logger.info(f"Gerenciando permissões para o usuário: {username}")
    user_id = f"user:{username}"

    try:
        # Buscar os dados do usuário no Redis
        user_data = redis_client.get(user_id)
        if not user_data:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        # Decodificar os dados do usuário
        try:
            user_data_dict = json.loads(user_data.decode('utf-8'))
            if not isinstance(user_data_dict, dict):
                raise ValueError(f"Formato inválido de dados: {user_data_dict}")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=f"Erro ao decodificar os dados do usuário: {str(e)}")

        # Atualizar as permissões do usuário
        user_data_dict['permissions'] = permissions.permissions
        user_data_json = json.dumps(user_data_dict)
        redis_client.set(user_id, user_data_json)

        return permissions

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


def configure(
    app: FastAPI
):
    app.include_router(router)
