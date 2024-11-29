from fastapi import FastAPI
from app.logging.logger import AppLogger
from fastapi.middleware.cors import CORSMiddleware

def create_app() -> FastAPI:
    # Configuração do logger
    logger = AppLogger().get_logger()

    # Criando a aplicação FastAPI
    app = FastAPI(
        title="Management System API",
        version="1.0.0",
        description="Acesse a API no endereço http://localhost:8000/docs",
    )

    # Adicionando o middleware de CORS
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
        return {
            "message": app.title,
            "version": app.version,
            "description": app.description,
        }

    # Importando e registrando os roteadores
    from app.machines import controller as machine_router
    from app.maintenance import controller as maintenance_router
    from app.teams import controller as teams_router
    from app.users import controller as users_route

    machine_router.configure(app)
    maintenance_router.configure(app)
    teams_router.configure(app)
    users_route.configure(app)

    return app
