from app.base_use_case import BaseUseCase
from infrastructure.logger import Logger
from services.machines_service import MachineService


class GetAllMachineUseCase(BaseUseCase):
    def __init__(self,  machine_service: MachineService, logger: Logger):
        self._machine_service = machine_service
        self._logger = logger

    async def run(self, start_date: str, end_date: str, limit: int, offset: int):
        return await self._machine_service.get_all(start_date=start_date, end_date=end_date,
                                        limit=limit, offset=offset)