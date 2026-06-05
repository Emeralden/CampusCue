from pydantic import BaseModel, model_validator, ConfigDict
from datetime import date, time as time_type
from typing import List

class ScheduleOverride(BaseModel):
    override_date: date
    target_day: str

class ScheduleItem(BaseModel):
    id: int
    item_type: str
    name: str
    room: str
    start_time: time_type
    end_time: time_type
    time: str = ""

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode='after')
    def compute_time(self) -> 'ScheduleItem':
        self.time = f"{self.start_time.strftime('%H:%M')}-{self.end_time.strftime('%H:%M')}"
        return self

class CourseSubscription(BaseModel):
    schedule_item_ids: List[int]


class DailyScheduleResponse(BaseModel):
    schedule_day: str
    has_override: bool
    items: List[ScheduleItem]
