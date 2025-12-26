from pydantic import BaseModel, computed_field
from datetime import date, time

class ScheduleOverride(BaseModel):
    override_date: date
    target_day: str

class ScheduleItem(BaseModel):
    id: int
    item_type: str
    name: str
    room: str
    start_time: time
    end_time: time

    @computed_field
    @property
    def time(self) -> str:
        return f"{self.start_time.strftime('%H:%M')}-{self.end_time.strftime('%H:%M')}"

    class Config:
        from_attributes = True
