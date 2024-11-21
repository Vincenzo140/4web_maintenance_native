from models.nosql.machines import Machine
from repositories.base_repository import NoSQLRepository


class NoSQLMachineRepository(NoSQLRepository):
    model = Machine