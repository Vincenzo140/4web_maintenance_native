from app.base_use_case import BaseUseCase
from infrastructure.logger import Logger
from services.machines_service import MachineService

class DeleteMachineUseCase(BaseUseCase):
    def __init__(self, machine_service: MachineService, logger: Logger):
        self._machine_service = machine_service
        self._logger = logger

    async def run(self, machine_id: str):
        return await self._machine_service.delete(machine_id)
