from pydantic import BaseModel
from typing import (
    List,
    Union,
    Optional
)


# Schema CRUD para Teams
class CreateTeamsSchema(BaseModel):
    team_id: Optional[str] = None
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
    team_id: str
    name: str
    members: List[Union[str, int]]
    specialites: List[str]
