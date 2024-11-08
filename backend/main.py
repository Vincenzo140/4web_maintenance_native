import json
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
import redis
from logger import AppLogger
from fastapi.middleware.cors import CORSMiddleware  



logger = AppLogger().get_logger()
# Configurando Redis
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# Definindo modelos de dados
class Machines(BaseModel):
    name: str
    type: str
    model: str
    manufacture_data: date
    serial_number: str
    location: str
    maintenance_history: List[str]

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

class RegisterTeamsOnMaintenance(BaseModel):
    name: str
    members: List[int]

class RegisterTeamMembers(BaseModel):
    team_id: int
    member_id: List[int]
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

# Inicializando a aplicação FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint para registrar uma nova máquina
@app.post("/machines", tags=["Machine Manage"], status_code=status.HTTP_201_CREATED, response_model=Machines)
def machine_register(machine_create: Machines) -> Machines:
    logger.info("Criando uma nova máquina")
    
    # Gerando um identificador único para a máquina
    machine_id = f"machine:{machine_create.serial_number}"
    
    # Verificando se a máquina já existe
    if redis_client.exists(machine_id):
        raise HTTPException(status_code=400, detail="Máquina já registrada.")
    
    # Salvando os dados da máquina

    machine_data = machine_create.dict()
    machine_data['manufacture_data'] = machine_data['manufacture_data'].isoformat()
    machine_data_json = json.dumps(machine_data)
    redis_client.set(machine_id, machine_data_json)
    redis_client.sadd("machines_list", machine_id)
    
    return machine_create

# Endpoint para obter todas as máquinas registradas
@app.get("/machines", tags=["Machine Manage"], response_model=List[Machines])
def get_machines() -> List[Machines]:
    logger.info("Obtendo todas as máquinas")
    machine_keys = redis_client.smembers("machines_list")
    machines = []
    for key in machine_keys:
        machine_data = redis_client.get(key)
        if machine_data:
            machines.append(Machines(**json.loads(machine_data.decode('utf-8'))))
    return machines

# Endpoint para obter uma máquina específica pelo número de série
@app.get("/machines/{serial_number}", tags=["Machine Manage"], response_model=Machines)
def get_machine(serial_number: str) -> Machines:
    logger.info(f"Obtendo máquina com número de série: {serial_number}")
    machine_id = f"machine:{serial_number}"
    machine_data = redis_client.get(machine_id)
    if not machine_data:
        raise HTTPException(status_code=404, detail="Máquina não encontrada")
    return Machines(**json.loads(machine_data.decode('utf-8')))

# Endpoint para atualizar dados de uma máquina
@app.put("/machines/{serial_number}", tags=["Machine Manage"], status_code=status.HTTP_202_ACCEPTED, response_model=Machines)
def update_machine(serial_number: str, machine_update: Machines) -> Machines:
    logger.info(f"Atualizando dados da máquina com número de série: {serial_number}")
    machine_id = f"machine:{serial_number}"
    machine_data = redis_client.get(machine_id)
    if not machine_data:
        raise HTTPException(status_code=404, detail="Máquina não encontrada")
    machine_data = json.loads(machine_data.decode('utf-8'))
    machine_data.update(machine_update.dict())
    machine_data_json = json.dumps(machine_data)

    redis_client.set(machine_id, machine_data_json)
    return Machines(**machine_data)

# Endpoint para remover uma máquina
@app.delete("/machines/{serial_number}", tags=["Machine Manage"], status_code=status.HTTP_204_NO_CONTENT)
def delete_machine(serial_number: str):
    logger.info(f"Removendo máquina com número de série: {serial_number}")
    machine_id = f"machine:{serial_number}"
    machine_data = redis_client.get(machine_id)
    if not machine_data:
        raise HTTPException(status_code=404, detail="Máquina não encontrada")
    redis_client.srem("machines_list", machine_id)
    redis_client.delete(machine_id)
    
    return None

# Endpoint para registrar uma nova manutenção
@app.post("/maintenance", tags=["Maintenance Manage"], status_code=status.HTTP_201_CREATED, response_model=Maintenance)
def maintenance_register(maintenance_create: Maintenance) -> Maintenance:
    logger.info("Criando uma nova manutenção")

    maintenance_id = f"maintenance:{maintenance_create.maintenance_register_id}"
    
    if redis_client.exists(maintenance_id):
        raise HTTPException(status_code=400, detail="Manutenção já registrada.")
    
    maintenance_data = maintenance_create.dict()
    maintenance_data['request_date'] = maintenance_data['request_date'].isoformat()
    maintenance_data_json = json.dumps(maintenance_data)
    redis_client.set(maintenance_id, maintenance_data_json)
    redis_client.sadd("maintenance_list", maintenance_id)
    
    return maintenance_create

# Endpoint para obter todas as manutenções registradas, com possibilidade de filtrar por máquina
@app.get("/maintenance", tags=["Maintenance Manage"], response_model=List[Maintenance])
def get_maintenance(machine_id: Optional[str] = None) -> List[Maintenance]:
    logger.info("Obtendo todas as manutenções")
    maintenance_keys = redis_client.smembers("maintenance_list")
    maintenance = []
    for key in maintenance_keys:
        maintenance_data = redis_client.get(key)
        if maintenance_data:
            maintenance_obj = Maintenance(**json.loads(maintenance_data.decode('utf-8')))
            if machine_id is None or maintenance_obj.machine_id == machine_id:
                maintenance.append(maintenance_obj)
    return maintenance

# Endpoint para obter uma manutenção específica pelo número de registro
@app.get("/maintenance/{maintenance_register_id}", tags=["Maintenance Manage"], response_model=Maintenance)
def get_maintenance_by_id(maintenance_register_id: str) -> Maintenance:
    logger.info(f"Obtendo manutenção com número de registro: {maintenance_register_id}")
    maintenance_id = f"maintenance:{maintenance_register_id}"
    maintenance_data = redis_client.get(maintenance_id)
    if not maintenance_data:
        raise HTTPException(status_code=404, detail="Manutenção não encontrada")
    return Maintenance(**json.loads(maintenance_data.decode('utf-8')))

# Endpoint para atualizar dados de uma manutenção
@app.put("/maintenance/{maintenance_register_id}", tags=["Maintenance Manage"], status_code=status.HTTP_202_ACCEPTED, response_model=Maintenance)
def update_maintenance(maintenance_register_id: str, maintenance_update: Maintenance) -> Maintenance:
    logger.info(f"Atualizando dados da manutenção com número de registro: {maintenance_register_id}")
    maintenance_id = f"maintenance:{maintenance_register_id}"
    maintenance_data = redis_client.get(maintenance_id)
    if not maintenance_data:
        raise HTTPException(status_code=404, detail="Manutenção não encontrada")
    maintenance_data = json.loads(maintenance_data.decode('utf-8'))
    
    maintenance_data.update(maintenance_update.dict())
    maintenance_data['request_date'] = maintenance_data['request_date'].isoformat()
    maintenance_data_json = json.dumps(maintenance_data)
    
    redis_client.set(maintenance_id, maintenance_data_json)
    return Maintenance(**maintenance_data)

# Endpoint para remover uma manutenção
@app.delete("/maintenance/{maintenance_register_id}", tags=["Maintenance Manage"], status_code=status.HTTP_204_NO_CONTENT)
def delete_maintenance(maintenance_register_id: str):
    logger.info(f"Removendo manutenção com número de registro: {maintenance_register_id}")
    maintenance_id = f"maintenance:{maintenance_register_id}"
    maintenance_data = redis_client.get(maintenance_id)
    if not maintenance_data:
        raise HTTPException(status_code=404, detail="Manutenção não encontrada")
    redis_client.srem("maintenance_list", maintenance_id)
    redis_client.delete(maintenance_id)
    
    return None

# Endpoint para registrar uma nova parte de reposição
@app.post("/parts", tags=["Parts Manager"], response_model=PostPartsOfReposition, status_code=status.HTTP_201_CREATED)
def post_parts_of_reposition(parts_of_reposition: PostPartsOfReposition) -> PostPartsOfReposition:
    logger.info("Criando uma nova parte de reposição")
    parts_of_reposition_id = f"parts:{parts_of_reposition.code}"
    
    if redis_client.exists(parts_of_reposition_id):
        raise HTTPException(status_code=400, detail="Parte já registrada.")
    
    parts_of_reposition_data = parts_of_reposition.dict()
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
    
    entry_parts_on_stock_data = entry_parts_on_stock.dict()
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
    
    register_back_off_parts_data = register_back_off_parts.dict()
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
@app.get("/parts/{code}", tags=["Parts Manager"], response_model=PostPartsOfReposition)
def get_parts_of_reposition_by_code(code: str) -> PostPartsOfReposition:
    logger.info(f"Obtendo parte de reposição com código: {code}")
    parts_of_reposition_id = f"parts:{code}"
    parts_of_reposition_data = redis_client.get(parts_of_reposition_id)
    if not parts_of_reposition_data:
        raise HTTPException(status_code=404, detail="Parte não encontrada")
    return PostPartsOfReposition(**json.loads(parts_of_reposition_data.decode('utf-8')))

# Endpoint para registrar uma nova equipe de manutenção
@app.post("/teams", tags=["Teams Manager"], response_model=RegisterTeamsOnMaintenance, status_code=status.HTTP_201_CREATED)
def register_teams_on_maintenance(register_teams_on_maintenance: RegisterTeamsOnMaintenance) -> RegisterTeamsOnMaintenance:
    logger.info("Registrando nova equipe de manutenção")
    team_id = f"team:{register_teams_on_maintenance.name}"
    
    if redis_client.exists(team_id):
        raise HTTPException(status_code=400, detail="Equipe já registrada.")
    
    team_data = register_teams_on_maintenance.dict()
    team_data_json = json.dumps(team_data)
    redis_client.set(team_id, team_data_json)
    redis_client.sadd("teams_list", team_id)
    
    return register_teams_on_maintenance

# Endpoint para obter todas as equipes registradas
@app.get("/teams", tags=["Teams Manager"], response_model=List[RegisterTeamsOnMaintenance])
def get_teams() -> List[RegisterTeamsOnMaintenance]:
    logger.info("Obtendo todas as equipes de manutenção")
    team_keys = redis_client.smembers("teams_list")
    teams = []
    for key in team_keys:
        team_data = redis_client.get(key)
        if team_data:
            teams.append(RegisterTeamsOnMaintenance(**json.loads(team_data.decode('utf-8'))))
    return teams

# Endpoint para obter uma equipe específica pelo nome
@app.get("/teams/{team_name}", tags=["Teams Manager"], response_model=RegisterTeamsOnMaintenance)
def get_team_by_name(team_name: str) -> RegisterTeamsOnMaintenance:
    logger.info(f"Obtendo equipe com nome: {team_name}")
    team_id = f"team:{team_name}"
    team_data = redis_client.get(team_id)
    if not team_data:
        raise HTTPException(status_code=404, detail="Equipe não encontrada")
    return RegisterTeamsOnMaintenance(**json.loads(team_data.decode('utf-8')))

# Endpoint para atualizar dados de uma equipe
@app.put("/teams/{team_name}", tags=["Teams Manager"], status_code=status.HTTP_202_ACCEPTED, response_model=RegisterTeamsOnMaintenance)
def update_team(team_name: str, team_update: RegisterTeamsOnMaintenance) -> RegisterTeamsOnMaintenance:
    logger.info(f"Atualizando dados da equipe com nome: {team_name}")
    team_id = f"team:{team_name}"
    team_data = redis_client.get(team_id)
    if not team_data:
        raise HTTPException(status_code=404, detail="Equipe não encontrada")
    team_data = json.loads(team_data.decode('utf-8'))
    team_data.update(team_update.dict())
    team_data['']
    team_data_json = json.dumps(team_data)
    redis_client.set(team_id, team_data_json)
    return RegisterTeamsOnMaintenance(**team_data)

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

# Inicializando o servidor
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
