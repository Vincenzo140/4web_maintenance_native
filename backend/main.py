from app_factory import create_app
from config import Config

app = create_app()
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", reload=True, port=Config.port)
