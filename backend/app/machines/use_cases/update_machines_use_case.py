from app.base_use_case import BaseUseCase
from infrastructure.logger import Logger
from services.machines_service import MachineService
from app.machines.schemas import UpdateMachinesSchema

class UpdateMachineUseCase(BaseUseCase):
    def __init__(self, machine_service: MachineService, logger: Logger):
        self._machine_service = machine_service
        self._logger = logger

    async def run(self, machine_id: str, machine_data: UpdateMachinesSchema):
        return await self._machine_service.update(machine_id, machine_data)