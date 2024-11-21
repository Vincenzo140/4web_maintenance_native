from datetime import datetime
import json
from bson import ObjectId
from app.maintenance.schemas import UpdateMaintenanceSchema 
from infrastructure.broker.interface import AbstractBroker
from infrastructure.broker.producer import Producer
from infrastructure.logger import Logger
from models.nosql.maintenance import Maintenance
from odmantic import AIOEngine

class MaintenanceService:
    def __init__(self, engine: AIOEngine, broker: AbstractBroker, logger: Logger) -> None:
        self._engine = engine
        self._broker = broker
        self._logger = logger

    async def send_message_to_send_email(self, topic_name: str, message: str):
        signature = Producer(topic=topic_name, message=message)
        return await self._broker.async_producer(signature=signature)

    async def create(self, machine_data: dict):
        # Criar uma nova máquina utilizando o modelo ODMantic
        maintenance = Maintenance(**machine_data)
        await self._engine.save(maintenance)
        
        message = {
            "name": maintenance.name,
            "type": maintenance.type,
            "model": maintenance.model,
            "serial_number": str(maintenance.serial_number),
            "location": maintenance.location,
            "maintenance_history": maintenance.maintenance_history,
            "status": maintenance.status
        }
        print(message)
        await self.send_message_to_send_email("send_email", json.dumps(message))

    async def get_all(self, start_date: str, end_date: str, limit: int, offset: int):
        filter = {
            "created_at": {
                "$gte": self._str2datetime(start_date),
                "$lte": self._str2datetime(end_date)
            }
        }
        return await self._engine.find(Maintenance, filter, skip=offset, limit=limit)

    async def get_by_id(self, maintenance_id: str):
        object_id = self._str2objectid(maintenance_id)
        return await self._engine.find_one(Maintenance, Maintenance.id == object_id)

    async def update(self, machine_id: str, machine_data: UpdateMaintenanceSchema):
        maintenance_data_dict = machine_data.model_dump(exclude_unset=True)
        object_id = self._str2objectid(machine_id)
        maintenance = await self._engine.find_one(Maintenance, Maintenance.id == object_id)
        if maintenance:
            for key, value in maintenance_data_dict.items():
                setattr(maintenance, key, value)
            await self._engine.save(maintenance)
        return maintenance

    async def delete(self, maintenance_id: str):
        object_id = self._str2objectid(maintenance_id)
        maintenance = await self._engine.find_one(Maintenance, Maintenance.id == object_id)
        if maintenance:
            await self._engine.delete(maintenance)
        return maintenance

    @staticmethod
    def _str2datetime(date_str):
        return datetime.strptime(date_str, "%Y-%m-%d")

    @staticmethod
    def _str2objectid(text: str):
        return ObjectId(text)
