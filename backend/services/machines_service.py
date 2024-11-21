from datetime import datetime
import json
from bson import ObjectId
from app.machines.schemas import UpdateMachinesSchema
from infrastructure.broker.interface import AbstractBroker
from infrastructure.broker.producer import Producer
from infrastructure.logger import Logger
from models.nosql.machines import Machine
from odmantic import AIOEngine

class MachineService:
    def __init__(self, engine: AIOEngine, broker: AbstractBroker, logger: Logger) -> None:
        self._engine = engine
        self._broker = broker
        self._logger = logger

    async def send_message_to_send_email(self, topic_name: str, message: str):
        signature = Producer(topic=topic_name, message=message)
        return await self._broker.async_producer(signature=signature)

    async def create(self, machine_data: dict):
        # Criar uma nova máquina utilizando o modelo ODMantic
        machine = Machine(**machine_data)
        await self._engine.save(machine)
        
        message = {
            "name": machine.name,
            "type": machine.type,
            "model": machine.model,
            "serial_number": str(machine.serial_number),
            "location": machine.location,
            "maintenance_history": machine.maintenance_history,
            "status": machine.status
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
        return await self._engine.find(Machine, filter, skip=offset, limit=limit)

    async def get_by_id(self, machine_id: str):
        object_id = self._str2objectid(machine_id)
        return await self._engine.find_one(Machine, Machine.id == object_id)

    async def update(self, machine_id: str, machine_data: UpdateMachinesSchema):
        machine_data_dict = machine_data.model_dump(exclude_unset=True)
        object_id = self._str2objectid(machine_id)
        machine = await self._engine.find_one(Machine, Machine.id == object_id)
        if machine:
            for key, value in machine_data_dict.items():
                setattr(machine, key, value)
            await self._engine.save(machine)
        return machine

    async def delete(self, machine_id: str):
        object_id = self._str2objectid(machine_id)
        machine = await self._engine.find_one(Machine, Machine.id == object_id)
        if machine:
            await self._engine.delete(machine)
        return machine

    @staticmethod
    def _str2datetime(date_str):
        return datetime.strptime(date_str, "%Y-%m-%d")

    @staticmethod
    def _str2objectid(text: str):
        return ObjectId(text)
