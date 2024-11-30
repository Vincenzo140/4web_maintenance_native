from pydantic import BaseModel, UUID4, Field
from typing import Optional, List
from datetime import date
import uuid

# Schema CRUD para Maintenance
class CreateMaintenanceSchema(BaseModel):
    maintenance_register_id: UUID4 = Field(default_factory=uuid.uuid4)
    problem_description: str
    request_date: date
    priority: str
    assigned_team_id: str
    status: str
    machine_id: str


class UpdateMaintenanceSchema(BaseModel):
    problem_description: Optional[str] = None
    request_date: Optional[date] = None
    priority: Optional[str] = None
    assigned_team_id: Optional[str] = None
    status: Optional[str] = None
    machine_id: Optional[str] = None


class DeleteMaintenanceSchema(BaseModel):
    maintenance_register_id: UUID4


class GetMaintenanceSchema(BaseModel):
    maintenance_register_id: UUID4
    problem_description: str
    request_date: date
    priority: str
    assigned_team_id: str
    status: str
    machine_id: str


class GetAllMaintenanceSchema(BaseModel):
    maintenance_register_id: UUID4  # Certifique-se de usar UUID4 aqui
    problem_description: str
    request_date: date
    priority: str
    assigned_team_id: Optional[str]
    status: str
    machine_id: str
