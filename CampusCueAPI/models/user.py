from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    id: Optional[int] = None
    email: EmailStr
    full_name: str

    mess_cycle: str

    class Config:
        form_attributes = True

class UserIn(User):
    password: str

class TokenRefresh(BaseModel):
    refresh_token: str
