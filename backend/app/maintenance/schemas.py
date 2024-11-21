from pydantic import BaseModel 
from typing import List, Union, Literal, Optional
from datetime import date
from enum import Enum

# Definindo o enum Role
class Role(Enum):
    EMPLOYEE = "employee"
    BOSS = "boss"
    ADMIN = "admin"

# Schema CRUD para Machines
class CreateMachinesSchema(BaseModel):
    name: str
    type: str
    model: str
    serial_number: str
    location: str
    maintenance_history: List[str]
    status: Literal["Operando", "Quebrado", "Em manutencao"]

class UpdateMachinesSchema(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    location: Optional[str] = None
    maintenance_history: Optional[List[str]] = None
    status: Optional[Literal["Operando", "Quebrado", "Em manutencao"]] = None

class DeleteMachinesSchema(BaseModel):
    machine_id: str

class GetMachinesSchema(BaseModel):
    machine_id: str

class GetAllMachinesSchema(BaseModel):
    limit: Optional[int] = None
    offset: Optional[int] = None

# Schema CRUD para Maintenance
class CreateMaintenanceSchema(BaseModel):
    maintenance_register_id: int
    problem_description: str
    request_date: date
    priority: str
    assigned_team: str
    status: str
    machine_id: str

class UpdateMaintenanceSchema(BaseModel):
    problem_description: Optional[str] = None
    request_date: Optional[date] = None
    priority: Optional[str] = None
    assigned_team: Optional[str] = None
    status: Optional[str] = None
    machine_id: Optional[str] = None

class DeleteMaintenanceSchema(BaseModel):
    maintenance_register_id: int

class GetMaintenanceSchema(BaseModel):
    maintenance_register_id: int

class GetAllMaintenanceSchema(BaseModel):
    limit: Optional[int] = None
    offset: Optional[int] = None

# Schema CRUD para Parts
class CreatePartsSchema(BaseModel):
    name: str
    code: str
    supplier: str
    quantity: int
    unit_price: float

class UpdatePartsSchema(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    supplier: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None

class DeletePartsSchema(BaseModel):
    code: str

class GetPartsSchema(BaseModel):
    code: str

class GetAllPartsSchema(BaseModel):
    limit: Optional[int] = None
    offset: Optional[int] = None

# Schema CRUD para Teams
class CreateTeamsSchema(BaseModel):
    name: str
    members: List[Union[str, int]]
    specialites: List[str]

class UpdateTeamsSchema(BaseModel):
    name: Optional[str] = None
    members: Optional[List[Union[str, int]]] = None
    specialites: Optional[List[str]] = None

class DeleteTeamsSchema(BaseModel):
    team_id: str

class GetTeamsSchema(BaseModel):
    team_id: str

class GetAllTeamsSchema(BaseModel):
    limit: Optional[int] = None
    offset: Optional[int] = None

# Schema para gerenciamento de Usuários
class CreateUserAccountSchema(BaseModel):
    username: str
    password: str
    role: Role

class UpdateUserAccountSchema(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[Role] = None

class DeleteUserAccountSchema(BaseModel):
    username: str

class GetUserAccountSchema(BaseModel):
    username: str

class GetAllUserAccountsSchema(BaseModel):
    limit: Optional[int] = None
    offset: Optional[int] = None

# Outros Schemas
class LoginUserSchema(BaseModel):
    username: str
    password: str

class ManageUsersPermissions(BaseModel):
    permissions: List[str]

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    username: Optional[str] = None
