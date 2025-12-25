from fastapi import FastAPI
from .routers import user,mess, schedule, satisfaction
from .database import database
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Connecting to database...")
    await database.connect()
    yield
    print("Disconnecting from database...")
    await database.disconnect()

app = FastAPI(
    title="CampusCue",
    lifespan=lifespan
    )

app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(mess.router, prefix = "/mess", tags=["Mess Menu"])
app.include_router(schedule.router, prefix="/schedule", tags=["Schedule"])
app.include_router(satisfaction.router, prefix="/satisfaction", tags=["Satisfaction"])

@app.get("/")
def read_root():
    return{"Hello": "Welcome to CampusCue!"}
