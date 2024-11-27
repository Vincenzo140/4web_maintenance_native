from fastapi import FastAPI
from app.logging.logger import AppLogger
from fastapi.middleware.cors import CORSMiddleware

from config import Config

# Configuração do logger
logger = AppLogger().get_logger()

# Declarando variáveis globais usando globals()
globals()['title'] = "Management System API"
globals()['version'] = "1.0.0"
globals()['description'] = "Acesse a API no endereço http://localhost:8000/docs"

# Função para criar a aplicação FastAPI
def create_app() -> FastAPI:
    # Criando a aplicação FastAPI com os valores globais
    app = FastAPI(
        title=globals()['title'],
        version=globals()['version'],
        description=globals()['description'],
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
    # from app.parts import controller as parts_router
    from app.teams import controller as teams_router
    from app.users import controller as users_route

    machine_router.configure(app)
    maintenance_router.configure(app)
    # parts_router.configure(app)
    teams_router.configure(app)
    users_route.configure(app)

    return app


# Inicializando o servidor
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=Config.port)
