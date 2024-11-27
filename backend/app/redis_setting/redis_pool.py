from redis import Redis
import redis
from tenacity import retry, stop_after_attempt, wait_exponential
from fastapi import HTTPException
import json

pool = redis.ConnectionPool(host='localhost', port=6379, db=0)

def get_redis_client():
    return redis.Redis(connection_pool=pool)

@retry(wait=wait_exponential(min=1, max=10), stop=stop_after_attempt(3))
def save_to_redis(redis_client, key, data):
    try:
        redis_client.set(key, json.dumps(data))
    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")
    
@retry(wait=wait_exponential(min=1, max=10), stop=stop_after_attempt(3))
def load_from_redis(redis_client, key):
    try:
        data = redis_client.get(key)
        return json.loads(data.decode('utf-8')) if data else None
    except (ConnectionError, TimeoutError) as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao Redis: {str(e)}")
