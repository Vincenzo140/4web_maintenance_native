import abc
from typing import AsyncContextManager, AsyncGenerator, Callable, Generic, List, TypeVar
from bson import ObjectId
from odmantic import AIOEngine, Model
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm.query import Query
from infrastructure.database.postgres_database import Base

T = TypeVar("T")

class IRepository(Generic[T], metaclass=abc.ABCMeta):
    def __init__(self, session_factory: Callable[[], AsyncContextManager[T]]) -> None:
        self.session_factory = session_factory

class NoSQLRepository(IRepository[AIOEngine]):
    model = Model

    async def get_by_id(self, id: ObjectId):
        async with self.session_factory() as session:
            return await session.find_one(self.model, {"_id": id})

    async def get_all(self, filter: dict = None, sort=None):
        async with self.session_factory() as session:
            return await session.find(self.model, filter, sort=sort)

    async def get_all_paginated(self, filter: dict = None, sort=None, offset: int = 0, limit: int = 500):
        async with self.session_factory() as session:
            return await session.find(self.model, filter, sort=sort, skip=offset, limit=limit)

    async def get_count(self, filter: dict):
        async with self.session_factory() as session:
            return await session.count(self.model, filter)

    async def aggregate(self, group: dict, filters: dict):
        async with self.session_factory() as session:
            collection = session.get_collection(self.model)
            return await collection.aggregate([filters, group]).to_list(length=None)

    async def update_one(self, values: dict, filters: dict):
        async with self.session_factory() as session:
            collection = session.get_collection(self.model)
            return await collection.update_one(filters, {'$set': values})

    async def delete_one(self, filters: dict):
        async with self.session_factory() as session:
            collection = session.get_collection(self.model)
            return await collection.delete_one(filters)

    async def insert_one(self, values: dict):
        async with self.session_factory() as session:
            try:
                return await session.save(self.model(**values))
            except Exception as e:
                catch_exc = e

        raise catch_exc

    async def get_paginated_data(self, filter: dict, offset: int, limit: int):
        async with self.session_factory() as session:
            paginated_data = await session.find(self.model, filter, skip=offset, limit=limit)
            total = await session.count(self.model, filter)
            return paginated_data, total


class SQLRepository(IRepository[AsyncSession]):
    model = Base

    async def get_all(self):
        async with self.session_factory() as session:
            result = await session.execute(select(self.model))
            return result.scalars().all()

    async def filter_by(self, params):
        async with self.session_factory() as session:
            result = await session.execute(select(self.model).filter_by(**params))
            
            return result.scalars().first()

    async def filter_all_by(self, params):
        async with self.session_factory() as session:
            result = await session.execute(select(self.model).filter_by(**params))
            return result.scalars().all()

    async def create(self, values: dict):
        async with self.session_factory() as session:
            _model = self.model(**values)
            session.add(_model)
            await session.commit()
            return _model

    async def update(self, pk, values):
        async with self.session_factory() as session:
            await session.execute(update(self.model).where(self.model.id == pk).values(**values))
            await session.commit()

    async def get_by_id(self, pk):
        async with self.session_factory() as session:
            result = await session.execute(select(self.model).where(self.model.id == pk))
            return result.scalars().first()

    async def delete_by_id(self, id: int):
        async with self.session_factory() as session:
            result = await session.execute(
                delete(self.model).where(self.model.id == id)
            )
            await session.commit()
            return result

    async def commit(self):
        async with self.session_factory() as session:
            await session.commit()

    async def rollback(self):
        async with self.session_factory() as session:
            await session.rollback()

    async def count(self, query: Query) -> int:
        async with self.session_factory() as session:
            result = await session.execute(query)

        return len(result.scalars().all())

    async def paginate(self, query: Query, limit: int, offset: int) -> List[Base]:
        async with self.session_factory() as session:
            result = await session.execute(query.limit(limit).offset(offset))

        return result.scalars().all()