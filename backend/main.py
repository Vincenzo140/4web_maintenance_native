from fastapi import FastAPI
from app.logging.logger import AppLogger
from fastapi.middleware.cors import CORSMiddleware
from app.routes.machines import router as machine_router
from app.routes.maintenance import router as maintenance_router
from app.routes.parts import router as parts_router
from app.routes.teams import router as teams_router
from app.routes.users import router as users_router
from app.logging.logger import AppLogger

logger = AppLogger().get_logger()
 
app = FastAPI(title="Management System API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo os routers corretamente
app.include_router(users_router, prefix="/users")
app.include_router(teams_router, prefix="/teams")
app.include_router(machine_router, prefix="/machines")
app.include_router(parts_router, prefix="/parts")
app.include_router(maintenance_router, prefix="/maintenance")

@app.get("/")
def read_root():
    logger.info("Servidor iniciado com sucesso")
    return {"message": f"{app.title}", "version": f"{app.version}"}

# Inicializando o servidor
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
