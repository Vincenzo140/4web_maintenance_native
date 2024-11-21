import logging
import logging.config

from aiologger.logger import Logger as AIOLogger
from aiologger.formatters.base import Formatter
from aiologger.handlers.streams import AsyncStreamHandler
from form_generator.config import Config

_log_fmt = "[%(name)s] %(asctime)s.%(msecs)d [%(process)d] [%(funcName)s] [%(levelname)s] %(message)s"
_log_datefmt = "%Y-%m-%d %H:%M:%S"


class Logger(AIOLogger):
    def __init__(self) -> None:
        super().__init__(level=Config.LOG_LEVEL)
        formatter = Formatter(fmt=_log_fmt, datefmt=_log_datefmt)
        default_handler = AsyncStreamHandler(level=Config.LOG_LEVEL, formatter=formatter)
        self.add_handler(default_handler)