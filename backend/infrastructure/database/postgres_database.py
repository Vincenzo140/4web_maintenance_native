from contextlib import asynccontextmanager
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncSession, async_scoped_session, create_async_engine, async_sessionmaker
from asyncio import current_task

from form_generator.config import Config
from form_generator.infrastructure.database.database import IDatabase

class Base(DeclarativeBase):
    pass

class PostgresDatabase(IDatabase):

    def __init__(self, db_url: str) -> None:
        self._engine = create_async_engine(db_url, echo=Config.SQL_ENABLE_ECHO, pool_size=int(Config.SQL_POOL_SIZE))
        self._session_factory = async_scoped_session(
            async_sessionmaker(self._engine, expire_on_commit=False), scopefunc=current_task)

    async def create_database(self) -> None:
        async with self._engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    @asynccontextmanager
    async def session(self):
        session: AsyncSession = self._session_factory()
        try:
            yield session
        except Exception:
            self.logger.exception('Postgres Session rollback because of exception')
            await session.rollback()
            raise
        finally:
            await session.close()
            await self._session_factory.remove()