from pydantic import BaseModel
from datetime import date

class ScheduleOverride(BaseModel):
    override_date: date
    target_day: str
