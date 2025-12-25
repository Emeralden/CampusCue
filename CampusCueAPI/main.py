from fastapi import FastAPI
from .routers import user,mess, schedule, satisfaction

app = FastAPI(title="CampusCue")

app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(mess.router, prefix = "/mess", tags=["Mess Menu"])
app.include_router(schedule.router, prefix="/schedule", tags=["Schedule"])
app.include_router(satisfaction.router, prefix="/satisfaction", tags=["Satisfaction"])

@app.get("/")
def read_root():
    return{"Hello": "Welcome to CampusCue!"}
