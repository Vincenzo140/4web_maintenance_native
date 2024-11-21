from odmantic import Model, Field
from typing import List, Literal, Optional
from datetime import datetime

# Model ODMantic para Machines
class Machine(Model):
    name: str = Field(..., description="Nome da máquina")
    type: str = Field(..., description="Tipo da máquina")
    model: str = Field(..., description="Modelo da máquina")
    serial_number: str = Field(..., description="Número de série da máquina")
    location: str = Field(..., description="Localização da máquina")
    maintenance_history: List[str] = Field(default_factory=list, description="Histórico de manutenção da máquina")
    status: Literal["Operando", "Quebrado", "Em manutencao"] = Field(..., description="Status atual da máquina")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Data de criação do registro")
    updated_at: Optional[datetime] = Field(None, description="Data da última atualização do registro")

    class Config:
        collection = "machines"

# Model ODMantic para operações de manutenção
class Maintenance(Model):
    machine_id: str = Field(..., description="ID da máquina")
    maintenance_description: str = Field(..., description="Descrição da manutenção realizada")
    maintenance_date: datetime = Field(default_factory=datetime.utcnow, description="Data da manutenção")
    technician: str = Field(..., description="Nome do técnico responsável")

    class Config:
        collection = "maintenance"
