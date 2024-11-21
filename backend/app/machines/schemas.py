from pydantic import BaseModel
from typing import List, Union, Literal, Optional

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