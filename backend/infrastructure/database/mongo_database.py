from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from odmantic import AIOEngine

from infrastructure.database.database import IDatabase

class MongoDatabase(IDatabase):
    def __init__(self, database: str, host: str, port: str, user: str, password: str) -> None:
        self.database = database
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self._conn_string = f'mongodb://{self.user}:{self.password}@{self.host}:{self.port}'
        self.motor_client = AsyncIOMotorClient(self._conn_string)
        self._session_factory = AIOEngine(client=self.motor_client, database=self.database)
        

    @asynccontextmanager
    async def session(self) -> AsyncGenerator[AIOEngine, None]:
        session = self._session_factory
        try:
            yield session
        except Exception:
            raise