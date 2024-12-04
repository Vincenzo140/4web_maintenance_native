from pydantic import BaseModel
from typing import (
    List,
    Union,
    Optional
)


# Schema CRUD para Parts
class CreatePartsSchema(BaseModel):
    code: str
    description: str
    location: str
    name: str
    quantity: int


class UpdatePartsSchema(BaseModel):
    code: Optional [str] = None
    description: Optional [str] = None
    location: Optional [str] = None
    name: Optional [str] = None
    quantity: Optional [int] = None


class DeletePartsSchema(BaseModel):
    code: str


class GetPartsSchema(BaseModel):
    code: str


class GetAllPartsSchema(BaseModel):
    code: str
    description: str
    location: str
    name: str
    quantity: int
