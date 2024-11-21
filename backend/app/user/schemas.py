from pydantic import BaseModel
from typing import List, Union, Optional
from enum import Enum

# Definindo o enum Role
class Role(Enum):
    EMPLOYEE = "employee"
    BOSS = "boss"
    ADMIN = "admin"

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

