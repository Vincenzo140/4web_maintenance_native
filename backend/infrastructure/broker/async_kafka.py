import asyncio
import json
from logging import getLogger
import os
from typing import Callable

from aiokafka import AIOKafkaConsumer, AIOKafkaProducer

from backend.infrastructure.broker.consumer import Consumer
from backend.infrastructure.broker.interface import AbstractBroker
from backend.infrastructure.broker.producer import Producer
from backend.infrastructure.logger import Logger


class AsyncKafkaBroker(AbstractBroker):
    def __init__(self, kfk_servers: str = None, enable_idempotence: bool = True, logger: Logger | None = None):
        self.enable_idempotence = enable_idempotence
        self.kfk_servers = kfk_servers
        self.logger = logger


    def publish(self, signature: Producer) -> None:
        return asyncio.run(self.async_producer(signature=signature))

    async def async_producer(self, signature: Producer) -> None:
        producer = AIOKafkaProducer(bootstrap_servers=self.kfk_servers, enable_idempotence=self.enable_idempotence)
        await producer.start()
        try:
            await producer.send_and_wait(signature.topic, signature.message.encode('utf-8'))
            print("mensagem enviada")
        finally:
            await producer.stop()