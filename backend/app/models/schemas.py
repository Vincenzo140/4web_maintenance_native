from pydantic import BaseModel 
from typing import List, Union, Literal, Optional
from datetime import date


class Machines(BaseModel):
    name: str
    type: str
    model: str
    serial_number: str
    location: str
    maintenance_history: List[str]
    status: Literal["Operando", "Quebrado", "Em manutenção"]
    
class Maintenance(BaseModel):
    maintenance_register_id: int
    problem_description: str
    request_date: date
    priority: str
    assigned_team: str
    status: str
    machine_id: str


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

class Teams(BaseModel):
    name: str
    members: List[Union[str, int]]
    specialites: List[str]
    

class LoginUser(BaseModel):
    username: str
    password: str

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