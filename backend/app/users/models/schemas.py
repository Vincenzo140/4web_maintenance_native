from pydantic import BaseModel
from typing import (
    List,
    Optional
)


class LoginUserSchema(BaseModel):
    username: str
    password: str


class CreateUserSchema(BaseModel):
    username: str
    password: str
    role: str


class ManageUsersPermissions(BaseModel):
    permissions: List[str]


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
