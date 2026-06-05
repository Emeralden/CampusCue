from pydantic import BaseModel
from datetime import date
from enum import Enum

class SatisfactionLevel(str, Enum):
    VERY_SATISFIED = "😄"
    SATISFIED = "🙂"
    NEUTRAL = "😐"
    DISSATISFIED = "🙁"
    VERY_DISSATISFIED = "😞"

class SatisfactionLogCreate(BaseModel):
    log_date: date
    satisfaction_level: SatisfactionLevel

class SatisfactionLog(SatisfactionLogCreate):
    id: int
    user_id: int

    class Config:
        form_atttributes = True