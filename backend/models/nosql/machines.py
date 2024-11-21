from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional
from odmantic import Model, EmbeddedModel, Index, Field, Reference
from odmantic.query import asc, desc
import pymongo

