from abc import ABCMeta, abstractmethod
from typing import Any, Callable

from infrastructure.broker.consumer import Consumer
from infrastructure.broker.producer import Producer

class AbstractBroker(metaclass=ABCMeta):

    @abstractmethod
    def publish(self, signature: Producer):
        pass

    @abstractmethod
    async def async_producer(self, signature: Producer):
        pass