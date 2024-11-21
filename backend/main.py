from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging as logger
from infrastructure.database.mongo_database import MongoDatabase
from models.nosql.machines import Machine, Maintenance
from contextlib import asynccontextmanager
from config import Config

globals()["title"] = "Management System API"
globals()["version"] = "1.0.0"
globals()["description"] = "Access http://localhost:8000/docs for real sauce"

app = FastAPI(title=globals()["title"], version=globals()["version"], description=globals()["description"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    logger.info("Servidor iniciado com sucesso")
    return {"message": f"{app.title}", "version": f"{app.version}", "description": f"{app.description}"}

async def configure_mongo_db(mongo_db: MongoDatabase):
    async with mongo_db.session() as session:
        await session.configure_database([Machine, Maintenance])

@asynccontextmanager
async def lifespan(app: FastAPI):
    await configure_mongo_db()
    yield

def create_app() -> FastAPI:
    app = FastAPI(openapi_url="/spec", lifespan=lifespan)
    from app.machines import controller as machine_controller
    machine_controller.configure(app)
    app.add_middleware(
         CORSMiddleware,
         allow_origins=["*"],
         allow_credentials=True,
         allow_methods=["*"],
         allow_headers=["*"],
    )
    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=Config.SERVER_PORT)
