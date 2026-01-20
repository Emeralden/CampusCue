from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class User(BaseModel):
    id: Optional[int] = None
    email: EmailStr
    full_name: str
    mess_cycle: str
    diet_type: str
    enable_satisfaction_prompt: bool
    class Config:
        form_attributes = True

class UserIn(User):
    password: str

class TokenRefresh(BaseModel):
    refresh_token: str

class DietType(str, Enum):
    VEG = "veg"
    NON_VEG = "non_veg"
    EGG = "egg"

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    diet_type: Optional[DietType] = None
    enable_satisfaction_prompt: Optional[bool] = None
