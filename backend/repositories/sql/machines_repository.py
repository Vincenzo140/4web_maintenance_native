from models.sql.machines import SQLMachine
from base_repository import SQLRepository

class SQLMachineRepository(SQLRepository):
    model = SQLMachine