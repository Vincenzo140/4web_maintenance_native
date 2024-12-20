from pydantic import BaseModel, Field
from typing import List, Optional


# Schema CRUD para Machines
class CreateMachinesSchema(BaseModel):
    name: str
    type: str
    model: str
    serial_number: str
    location: str
    maintenance_history: List[str]
    status: str

class UpdateMachinesSchema(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    location: Optional[str] = None
    maintenance_history: Optional[List[str]] = None
    status: Optional[str] = None

class DeleteMachinesSchema(BaseModel):
    machine_id: str

class GetMachinesSchema(BaseModel):
    machine_id: str

class GetAllMachinesSchema(BaseModel):
    name: str
    type: str
    model: str
    serial_number: str
    location: str
    maintenance_history: List[str]
    status: str
