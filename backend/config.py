from os import getenv
from distutils.util import strtobool
import dotenv

dotenv.load_dotenv()

class Config:
    MONGO_DATABASE_DB = getenv('MONGO_DATABASE_DB', 'form_generator')
    MONGO_DATABASE_HOST = getenv('MONGO_DATABASE_HOST', 'mongodb')
    MONGO_DATABASE_PORT = int(getenv('MONGO_DATABASE_PORT', 27017))
    MONGO_DATABASE_USER = getenv('MONGO_DATABASE_USER', 'root')
    MONGO_DATABASE_PASSWORD = getenv('MONGO_DATABASE_PASSWORD', 'root')

    LOG_LEVEL = getenv('LOG_LEVEL', 'DEBUG')

    BROKER_SERVER = getenv('BROKER_SERVER', 'broker:29092')
    KAFKA_PRODUCER_ENABLE_IDEMPOTENCE = bool(strtobool(getenv('KAFKA_PRODUCER_ENABLE_IDEMPOTENCE', 'true')))

    SERVER_PORT = int(getenv('SERVER_PORT', '8080'))
    DATABASE_URL=getenv('DATABASE_URL', 'postgresql+psycopg://postgres:bHkH242GdlkgVXMtGWKrGV96iL8F5-Dw@psql:5432/academy') 

    POSTGRES_PASSWORD=getenv('POSTGRES_PASSWORD', "bHkH242GdlkgVXMtGWKrGV96iL8F5-Dw")
    POSTGRES_USER=getenv('POSTGRES_USER', "postgres")
    POSTGRES_DB=getenv('POSTGRES_DB', "academy")
    PGPORT=getenv('PGPORT', "5432")

    SQL_POOL_SIZE=getenv('SQL_POOL_SIZE', "40")
    SQL_ENABLE_ECHO=bool(strtobool(getenv('SQL_ENABLE_ECHO', 'True')))