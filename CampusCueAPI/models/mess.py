from pydantic import BaseModel

class MessPreferenceUpdate(BaseModel):
    mess_cycle: str

    