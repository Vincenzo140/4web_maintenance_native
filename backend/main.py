import json
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
import logging as logger
from datetime import date
import redis

# Configurando Redis
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# Configurando logger
logger.basicConfig(level=logger.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger.getLogger(__name__)

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
    entry_date: date

class RegisterBackOffParts(BaseModel):
    quantity: int
    exit_date: date

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
    Maintenance_id: int

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
    machine_data['manufacture_date'] = machine_data['manufacture_date'].isoformat()
    machine_data_json = json.dumps(machine_data)
    redis_client.hset(machine_id, "machine_data", machine_data_json)
    redis_client.sadd("machines_list", machine_id)
    
    return machine_create

# Endpoint para obter todas as máquinas registradas
@app.get("/machines", tags=["Machine Manage"], response_model=List[Machines])
def get_machines() -> List[Machines]:
    logger.info("Obtendo todas as máquinas")
    machine_keys = redis_client.smembers("machines_list")
    machines = []
    for key in machine_keys:
        machine_data = redis_client.hget(key, "machine_data")
        if machine_data:
            machines.append(Machines(**json.loads(machine_data.decode('utf-8'))))
    return machines

# Endpoint para obter uma máquina específica pelo nome
@app.get("/machines/{serial_number}", tags=["Machine Manage"] , response_model=Machines)
def get_machine(serial_number: str) -> Machines:
    logger.info(f"Obtendo máquina com número de série: {serial_number}")
    machine_id = f"machine:{serial_number}"
    machine_data = redis_client.hget(machine_id, "machine_data")
    if not machine_data:
        raise HTTPException(status_code=404, detail="Máquina não encontrada")
    return Machines(**json.loads(machine_data.decode('utf-8')))

# Endpoint para atualizar dados de uma máquina
@app.put("/machines/{serial_number}", tags=["Machine Manage"], status_code=status.HTTP_202_ACCEPTED, response_model=Machines)
def update_machine(serial_number: str, machine_update: Machines) -> Machines:
    logger.info(f"Atualizando dados da máquina com número de série: {serial_number}")
    machine_id = f"machine:{serial_number}"
    machine_data = redis_client.hget(machine_id, "machine_data")
    if not machine_data:
        raise HTTPException(status_code=404, detail="Máquina não encontrada")
    machine_data = json.loads(machine_data.decode('utf-8'))
    machine_data.update(machine_update.dict())
    machine_data['manufacture_data'] = machine_data['manufacture_data'].isoformat()
    machine_data_json = json.dumps(machine_data)

    redis_client.hset(machine_id, "machine_data", machine_data_json)
    return Machines(**machine_data)

# Endpoint para remover uma máquina
@app.delete("/machines/{serial_number}", tags=["Machine Manage"], status_code=status.HTTP_204_NO_CONTENT)
def delete_machine(serial_number: str):
    logger.info(f"Removendo máquina com número de série: {serial_number}")
    machine_id = f"machine:{serial_number}"
    machine_data = redis_client.hget(machine_id, "machine_data")
    if not machine_data:
        raise HTTPException(status_code=404, detail="Máquina não encontrada")
    redis_client.srem("machines_list", machine_id)
    redis_client.delete(machine_id)
    
    return None

# Endpoint para registrar uma nova manutenção
@app.post("/maintenance", tags=["Maintenance Manage"], status_code=status.HTTP_201_CREATED, response_model=Maintenance)
def maintenance_register(maintenance_create: Maintenance) -> Maintenance:
    logger.info("Criando uma nova manuntenção")

    maintenance_id = f"maintenance:{maintenance_create.maintenance_register_id}"
    
    if redis_client.exists(maintenance_id):
        raise HTTPException(status_code=400, detail="Máquina já registrada.")
    
    maintenance_data = maintenance_create.dict()
    maintenance_data['request_date'] = maintenance_data['request_date'].isoformat()
    maintenance_data_json = json.dumps(maintenance_data)
    redis_client.hset(maintenance_id, "maintenance_data", maintenance_data_json)
    redis_client.sadd("maintenance_list", maintenance_id)
    
    return maintenance_create
    
# Inicializando o servidor
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)