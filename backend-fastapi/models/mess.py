from pydantic import BaseModel

class MessMenuItem(BaseModel):
    id: int
    cycle_type: str
    day_of_week: str
    meal_type: str
    description: str

    class Config:
        from_attributes = True

    