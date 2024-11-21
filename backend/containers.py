from dependency_injector import containers, providers
from app.machines.use_cases.create_machines_use_case import CreateMachineUseCase 
from app.machines.use_cases.delete_machines_use_case import  DeleteMachineUseCase
from app.machines.use_cases.get_machines_use_case import GetMachineUseCase
from app.machines.use_cases.get_all_machines_use_case import GetAllMachineUseCase
from app.machines.use_cases.update_machines_use_case import UpdateMachineUseCase


from config import Config
from infrastructure.broker.async_kafka import AsyncKafkaBroker
from infrastructure.database.mongo_database import MongoDatabase
from infrastructure.database.postgres_database import PostgresDatabase
from infrastructure.logger import Logger
from repositories.nosql.machines_repository import NoSQLMachineRepository
from services.machines_service import MachineService
from repositories.sql.machines_repository import SQLMachineRepository

class Container(containers.DeclarativeContainer):
    config = providers.Configuration()

    logger = providers.Singleton(Logger)

    broker = providers.Singleton(AsyncKafkaBroker, kfk_servers=Config.BROKER_SERVER, enable_idempotence=Config.KAFKA_PRODUCER_ENABLE_IDEMPOTENCE)

    mongo_database = providers.Singleton(
        MongoDatabase, database=Config.MONGO_DATABASE_DB, host=Config.MONGO_DATABASE_HOST, port=Config.MONGO_DATABASE_PORT, user=Config.MONGO_DATABASE_USER, password=Config.MONGO_DATABASE_PASSWORD
    )

    postgres_database = providers.Singleton(
        PostgresDatabase, db_url=Config.DATABASE_URL
    )

    nosql_machine_repository = providers.Singleton(
        NoSQLMachineRepository, session_factory=mongo_database.provided.session
    )

    sql_machine_repository = providers.Singleton(
        SQLMachineRepository, session_factory=postgres_database.provided.session
    )

    # Machine

    machine_service = providers.Factory(MachineService, nosql_machine_repository, sql_machine_repository, broker, logger)

    get_all_machines_use_case = providers.Factory(GetAllMachineUseCase, machine_service, logger)

    create_machine_use_case = providers.Factory(CreateMachineUseCase, machine_service, logger)

    get_machine_use_case = providers.Factory(GetMachineUseCase, machine_service, logger)
    
    update_machine_use_case = providers.Factory(UpdateMachineUseCase, machine_service, logger)

    delete_machine_use_case = providers.Factory(DeleteMachineUseCase, machine_service, logger)