from pydantic import BaseModel
from typing import List, Union, Optional

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
