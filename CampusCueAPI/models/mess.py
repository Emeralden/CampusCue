from pydantic import BaseModel
from typing import Optional

class MessPreferenceUpdate(BaseModel):
    mess_cycle: str

    