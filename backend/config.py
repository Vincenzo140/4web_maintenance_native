class Config:
    # Api configuration
    port=8000
    host= 'localhost'
    
    
    # Redis configuration
    REDIS_HOST = 'redis'
    REDIS_PORT = 6379
    REDIS_DB = 0
    
    # JWT configuration
    
    SECRET_KEY = "secret"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
