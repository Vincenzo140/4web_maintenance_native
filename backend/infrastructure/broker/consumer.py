from dataclasses import dataclass
from typing import Optional


@dataclass
class Consumer():
    key: Optional[str] = None
    next_topic: Optional[str] = None
    group_id: Optional[str] = None
    session_timeout_ms: int = 120000
    request_timeout_ms: int = 120000