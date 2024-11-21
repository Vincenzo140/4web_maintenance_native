from models.nosql.machines import Machine
from repositories.base_repository import NoSQLRepository


class NoSQLFormRepository(NoSQLRepository):
    model = Machine