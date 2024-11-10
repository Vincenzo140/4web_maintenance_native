import json
from fastapi import FastAPI, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional, List, Union, Literal
from datetime import date, datetime, timedelta
import redis
from logger import AppLogger
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import redis
from redis.exceptions import ConnectionError, TimeoutError
from tenacity import retry, wait_exponential, stop_after_attempt

from redis import Redis

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



pool = redis.ConnectionPool(host='localhost', port=6379, db=0)

def get_redis_client():
    return redis.Redis(connection_pool=pool)

@retry(wait=wait_exponential(min=1, max=10), stop=stop_after_attempt(3))
def save_to_redis(redis_client, key, data):
    try:
        redis_client.set(key, json.dumps(data))
    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")
    
@retry(wait=wait_exponential(min=1, max=10), stop=stop_after_attempt(3))
def load_from_redis(redis_client, key):
    try:
        data = redis_client.get(key)
        return json.loads(data.decode('utf-8')) if data else None
    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")


# Configurações JWT
SECRET_KEY = "secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

logger = AppLogger().get_logger()
# Configurando Redis
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# Configurando o contexto de criptografia de senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configurando OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Definindo modelos de dados
class Machines(BaseModel):
    name: str
    type: str
    model: str
    serial_number: str
    location: str
    maintenance_history: List[str]
    status: Literal["operando", "Quebrado", "Em Manuntenção"]
    
class Maintenance(BaseModel):
    maintenance_register_id: int
    problem_description: str
    request_date: date
    priority: str
    assigned_team: str
    status: str
    machine_id: str

class MaintenanceStatus(BaseModel):
    status: str
    comments: str
    related_files: List[str]

class SolicitationMaintenance(BaseModel):
    team_id: int
    responsible_member: int

class PartsUsageInMaintenance(BaseModel):
    part_id: int
    quantity: int
    supplier: str

class ListMaintenancePerMachine(BaseModel):
    machine_id: Optional[int]
    period: Optional[str]
    machine_type: Optional[str]

class PostPartsOfReposition(BaseModel):
    name: str
    code: str
    supplier: str
    quantity: int
    unit_price: float

class EntryPartsOnStock(BaseModel):
    quantity: int
    entry_date: date = date.today()

class RegisterBackOffParts(BaseModel):
    quantity: int
    exit_date: date = date.today()

class ViewPartsOnStock(BaseModel):
    filters: Optional[str]

class Teams(BaseModel):
    name: str
    members: List[Union[str, int]]
    specialites: List[str]
    
class AssignTeamToMaintenance(BaseModel):
    maintenance_id: int

class ManageTeamsAvailability(BaseModel):
    member_id: int
    availability_status: str

class CreateUserAccount(BaseModel):
    username: str
    password: str
    role: str

class LoginUser(BaseModel):
    username: str
    password: str

class ManageUsersPermissions(BaseModel):
    permissions: List[str]


# Definindo modelos de dados
class CreateUserAccount(BaseModel):
    username: str
    password: str
    role: str

class LoginUser(BaseModel):
    username: str
    password: str

class ManageUsersPermissions(BaseModel):
    permissions: List[str]

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Função para gerar senha hash
def get_password_hash(password):
    return pwd_context.hash(password)

# Função para verificar senha
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Função para criar um token de acesso
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

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
def get_current_user(token: str = Depends(oauth2_scheme)):
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

# Inicializando a aplicação FastAPI


# Endpoint para registrar uma nova máquina
@app.post("/machines", tags=["Machine Manage"], status_code=status.HTTP_201_CREATED, response_model=Machines)
def machine_register(machine_create: Machines, redis_client: redis.Redis = Depends(get_redis_client)) -> Machines:
    logger.info(f"Criando uma nova máquina {machine_create.name}")

    # Gerando um identificador único para a máquina
    machine_id = f"machine:{machine_create.serial_number}"

    try:
        # Verificando se a máquina já existe
        if redis_client.exists(machine_id):
            raise HTTPException(status_code=400, detail="Máquina já registrada.")

        # Salvando os dados da máquina
        machine_data = machine_create.dict()
        machine_data_json = json.dumps(machine_data)
        redis_client.set(machine_id, machine_data_json)
        redis_client.sadd("machines_list", machine_id)

    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return machine_create

# Endpoint para obter todas as máquinas registradas
@app.get("/machines", tags=["Machine Manage"], response_model=List[Machines])
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
@app.get("/machines/{serial_number}", tags=["Machine Manage"], response_model=Machines)
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
@app.put("/machines/{serial_number}", tags=["Machine Manage"], status_code=status.HTTP_202_ACCEPTED, response_model=Machines)
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
        machine_data_dict.update(machine_update.dict())
        machine_data_json = json.dumps(machine_data_dict)

        # Atualizar os dados da máquina no Redis
        redis_client.set(machine_id, machine_data_json)

        return Machines(**machine_data_dict)

    except (ConnectionError, TimeoutError) as e:
        # Tratar erro de conexão com o Redis
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para remover uma máquina
@app.delete("/machines/{serial_number}", tags=["Machine Manage"], status_code=status.HTTP_204_NO_CONTENT)
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
# Endpoint para registrar uma nova manutenção
@app.post("/maintenance", tags=["Maintenance Manage"], status_code=status.HTTP_201_CREATED, response_model=Maintenance)
def maintenance_register(maintenance_create: Maintenance, redis_client: redis.Redis = Depends(get_redis_client)) -> Maintenance:
    logger.info(f"Criando uma nova manutenção {maintenance_create.maintenance_register_id}")

    maintenance_id = f"maintenance:{maintenance_create.maintenance_register_id}"

    try:
        # Verificando se a manutenção já existe
        if redis_client.exists(maintenance_id):
            raise HTTPException(status_code=400, detail="Manutenção já registrada.")

        # Salvando os dados da manutenção
        maintenance_data = maintenance_create.dict()
        maintenance_data['request_date'] = maintenance_data['request_date'].isoformat()
        maintenance_data_json = json.dumps(maintenance_data)
        redis_client.set(maintenance_id, maintenance_data_json)
        redis_client.sadd("maintenance_list", maintenance_id)

    except (ConnectionError, TimeoutError) as e:
        # Tratar erro de conexão com o Redis
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

    return maintenance_create

# Endpoint para obter todas as manutenções registradas, com possibilidade de filtrar por máquina
@app.get("/maintenance", tags=["Maintenance Manage"], response_model=List[Maintenance])
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
@app.get("/maintenance/{maintenance_register_id}", tags=["Maintenance Manage"], response_model=Maintenance)
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
@app.put("/maintenance/{maintenance_register_id}", tags=["Maintenance Manage"], status_code=status.HTTP_202_ACCEPTED, response_model=Maintenance)
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
        maintenance_data_dict.update(maintenance_update.dict())
        maintenance_data_dict['request_date'] = maintenance_data_dict['request_date'].isoformat()
        maintenance_data_json = json.dumps(maintenance_data_dict)

        # Atualizar os dados da manutenção no Redis
        redis_client.set(maintenance_id, maintenance_data_json)

        return Maintenance(**maintenance_data_dict)

    except (ConnectionError, TimeoutError) as e:
        # Tratar erro de conexão com o Redis
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")

# Endpoint para remover uma manutenção
@app.delete("/maintenance/{maintenance_register_id}", tags=["Maintenance Manage"], status_code=status.HTTP_204_NO_CONTENT)
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

# Endpoint para registrar uma nova parte de reposição
@app.post("/parts", tags=["Parts Manager"], response_model=PostPartsOfReposition, status_code=status.HTTP_201_CREATED)
def post_parts_of_reposition(parts_of_reposition: PostPartsOfReposition) -> PostPartsOfReposition:
    logger.info("Criando uma nova parte de reposição")
    parts_of_reposition_id = f"parts:{parts_of_reposition.code}"
    
    if redis_client.exists(parts_of_reposition_id):
        raise HTTPException(status_code=400, detail="Parte já registrada.")
    
    parts_of_reposition_data = parts_of_reposition.model_dump()
    parts_of_reposition_data_json = json.dumps(parts_of_reposition_data)
    redis_client.set(parts_of_reposition_id, parts_of_reposition_data_json)
    redis_client.sadd("parts_list", parts_of_reposition_id)
    
    return parts_of_reposition

# Endpoint para registrar entrada de partes no estoque
@app.post("/parts/{code}/entry", tags=["Parts Manager"], status_code=status.HTTP_201_CREATED, response_model=EntryPartsOnStock)
def entry_parts_on_stock(code: str, entry_parts_on_stock: EntryPartsOnStock) -> EntryPartsOnStock:
    logger.info(f"Registrando entrada de parte com código: {code}")
    
    parts_of_reposition_id = f"parts:{code}"
    
    parts_of_reposition_data = redis_client.get(parts_of_reposition_id)
    if not parts_of_reposition_data:
        raise HTTPException(status_code=404, detail="Parte não encontrada")
    parts_of_reposition_data = json.loads(parts_of_reposition_data.decode('utf-8'))
    
    entry_parts_on_stock_data = entry_parts_on_stock.model_dump()
    entry_parts_on_stock_data['entry_date'] = entry_parts_on_stock_data['entry_date'].isoformat()
    entry_parts_on_stock_data_json = json.dumps(entry_parts_on_stock_data)
    redis_client.set(parts_of_reposition_id, entry_parts_on_stock_data_json)
    
    return entry_parts_on_stock

# Endpoint para registrar saída de partes no estoque
@app.post("/parts/{code}/exit", tags=["Parts Manager"], status_code=status.HTTP_201_CREATED, response_model=RegisterBackOffParts)
def exit_parts_on_stock(code: str, register_back_off_parts: RegisterBackOffParts) -> RegisterBackOffParts:
    logger.info(f"Register back off parts with code: {code}")
    
    parts_of_reposition_id = f"parts:{code}"
    
    parts_of_reposition_data = redis_client.get(parts_of_reposition_id)
    if not parts_of_reposition_data:
        raise HTTPException(status_code=404, detail="Parte não encontrada")
    parts_of_reposition_data = json.loads(parts_of_reposition_data.decode('utf-8'))
    
    register_back_off_parts_data = register_back_off_parts.model_dump()
    register_back_off_parts_data['exit_date'] = register_back_off_parts_data['exit_date'].isoformat()
    register_back_off_parts_data_json = json.dumps(register_back_off_parts_data)
    redis_client.set(parts_of_reposition_id, register_back_off_parts_data_json)
    
    return register_back_off_parts

# Endpoint para obter todas as partes registradas
@app.get("/parts", tags=["Parts Manager"], response_model=List[PostPartsOfReposition])
def get_parts_of_reposition() -> List[PostPartsOfReposition]:
    logger.info("Obtendo todas as partes de reposição")
    parts_of_reposition_keys = redis_client.smembers("parts_list")
    parts_of_reposition = []
    for key in parts_of_reposition_keys:
        parts_of_reposition_data = redis_client.get(key)
        if parts_of_reposition_data:
            parts_of_reposition.append(PostPartsOfReposition(**json.loads(parts_of_reposition_data.decode('utf-8'))))
    return parts_of_reposition

# Endpoint para obter uma parte de reposição específica pelo código
@app.get("/parts/{code}", tags=["Parts Manager"], response_model=PostPartsOfReposition, status_code=status.HTTP_200_OK)
def get_parts_of_reposition_by_code(code: str) -> PostPartsOfReposition:
    logger.info(f"Obtendo parte de reposição com código: {code}")
    parts_of_reposition_id = f"parts:{code}"
    parts_of_reposition_data = redis_client.get(parts_of_reposition_id)
    if not parts_of_reposition_data:
        raise HTTPException(status_code=404, detail="Parte não encontrada")
    return PostPartsOfReposition(**json.loads(parts_of_reposition_data.decode('utf-8')))

# Endpoint para registrar uma nova equipe de manutenção
@app.post("/teams", tags=["Teams Manager"], response_model=Teams, status_code=status.HTTP_201_CREATED)
def register_teams_on_maintenance(register_teams_on_maintenance: Teams) -> Teams:
    logger.info("Registrando nova equipe de manutenção")
    team_id = f"team:{register_teams_on_maintenance.name}"
    
    if redis_client.exists(team_id):
        raise HTTPException(status_code=400, detail="Equipe já registrada.")
    
    team_data = register_teams_on_maintenance.model_dump()
    team_data_json = json.dumps(team_data)
    redis_client.set(team_id, team_data_json)
    redis_client.sadd("teams_list", team_id)
    
    return register_teams_on_maintenance

# Endpoint para obter todas as equipes registradas
@app.get("/teams", tags=["Teams Manager"], response_model=List[Teams])
def get_teams() -> List[Teams]:
    logger.info("Obtendo todas as equipes de manutenção")
    team_keys = redis_client.smembers("teams_list")
    teams = []
    for key in team_keys:
        team_data = redis_client.get(key)
        if team_data:
            teams.append(Teams(**json.loads(team_data.decode('utf-8'))))
    return teams

# Endpoint para obter uma equipe específica pelo nome
@app.get("/teams/{team_name}", tags=["Teams Manager"], response_model=Teams)
def get_team_by_name(team_name: str) -> Teams:
    logger.info(f"Obtendo equipe com nome: {team_name}")
    team_id = f"team:{team_name}"
    team_data = redis_client.get(team_id)
    if not team_data:
        raise HTTPException(status_code=404, detail="Equipe não encontrada")
    return Teams(**json.loads(team_data.decode('utf-8')))

# Endpoint para atualizar dados de uma equipe
@app.put("/teams/{team_name}", tags=["Teams Manager"], status_code=status.HTTP_202_ACCEPTED, response_model=Teams)
def update_team(team_name: str, team_update: Teams) -> Teams:
    logger.info(f"Atualizando dados da equipe com nome: {team_name}")
    team_id = f"team:{team_name}"
    team_data = redis_client.get(team_id)
    if not team_data:
        raise HTTPException(status_code=404, detail="Equipe não encontrada")
    team_data = json.loads(team_data.decode('utf-8'))
    team_data.update(team_update.model_dump())
    team_data['']
    team_data_json = json.dumps(team_data)
    redis_client.set(team_id, team_data_json)
    return Teams(**team_data)

# Endpoint para remover uma equipe
@app.delete("/teams/{team_name}", tags=["Teams Manager"], status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_name: str):
    logger.info(f"Removendo equipe com nome: {team_name}")
    team_id = f"team:{team_name}"
    team_data = redis_client.get(team_id)
    if not team_data:
        raise HTTPException(status_code=404, detail="Equipe não encontrada")
    redis_client.srem("teams_list", team_id)
    redis_client.delete(team_id)
    
    return None

# Endpoint para criar um novo usuário
@app.post("/users", tags=["User Management"], status_code=status.HTTP_201_CREATED, response_model=CreateUserAccount)
def create_user(user: CreateUserAccount) -> CreateUserAccount:
    logger.info(f"Criando novo usuário: {user.username}")
    user_id = f"user:{user.username}"
    
    # Verificando se o usuário já existe
    if redis_client.exists(user_id):
        raise HTTPException(status_code=400, detail="Usuário já registrado.")
    
    # Criptografando a senha e salvando os dados do usuário
    user_data = user.dict()
    user_data["password"] = get_password_hash(user.password)
    user_data_json = json.dumps(user_data)
    redis_client.set(user_id, user_data_json)
    redis_client.sadd("users_list", user_id)
    
    return user

# Endpoint para fazer login e obter o token de acesso
@app.post("/token", tags=["User Management"], response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint para gerenciar permissões de usuário
@app.put("/users/{username}/permissions", tags=["User Management"], status_code=status.HTTP_202_ACCEPTED, response_model=ManageUsersPermissions)
def manage_user_permissions(username: str, permissions: ManageUsersPermissions, current_user: dict = Depends(get_current_user)) -> ManageUsersPermissions:
    logger.info(f"Gerenciando permissões para o usuário: {username}")
    user_id = f"user:{username}"
    user_data = redis_client.get(user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    user_data = json.loads(user_data.decode('utf-8'))
    
    # Atualizando permissões do usuário
    user_data['permissions'] = permissions.permissions
    user_data_json = json.dumps(user_data)
    redis_client.set(user_id, user_data_json)
    
    return permissions

# Inicializando o servidor
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
