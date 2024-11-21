from dataclasses import dataclass
from typing import Optional

@dataclass
class Producer:
    topic: str
    message: str
    key: Optional[str] = None

@dataclass
class SendEmailMessage:
    email: str