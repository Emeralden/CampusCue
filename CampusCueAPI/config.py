from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    env_state: str = "dev"

    class Config:
        env_file = ".env"

settings = Settings() # type: ignore


