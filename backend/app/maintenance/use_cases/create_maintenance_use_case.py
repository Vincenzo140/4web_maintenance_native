from app.base_use_case import BaseUseCase
from app.machines.schemas import CreateMachinesSchema
from infrastructure.logger import Logger
from services.machines_service import MachineService


class CreateMachineUseCase(BaseUseCase):
    def __init__(self, machine_service: MachineService, logger: Logger):
        self._form_service = machine_service
        self._logger = logger

    async def run(self, machine_data: CreateMachinesSchema):
        await self._form_service.create(machine_data)