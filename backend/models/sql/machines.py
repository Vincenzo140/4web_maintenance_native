from sqlalchemy import Column, String, DateTime, Integer
from infrastructure.database.postgres_database import Base
from datetime import datetime

class SQLMachine(Base):
    __tablename__ = 'machines'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    model = Column(String, nullable=False)
    serial_number = Column(String, unique=True, nullable=False)
    location = Column(String, nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, onupdate=datetime.now)
