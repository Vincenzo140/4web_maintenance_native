from app.base_use_case import BaseUseCase
from app.maintenance.schemas import CreateMaintenanceSchema 
from infrastructure.logger import Logger
from services.maintenance_service import MaintenanceService


class CreateMachineUseCase(BaseUseCase):
    def __init__(self, machine_service: MaintenanceService, logger: Logger):
        self._machine_service = machine_service
        self._logger = logger

    async def run(self, machine_data: CreateMaintenanceSchema):
        await self._machine_service.create(machine_data)