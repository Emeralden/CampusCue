import logging
from datetime import datetime, timedelta, timezone
from typing import Annotated

import sqlalchemy
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import settings
from .database import database, users_table

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    return pwd_context.verify(plain_password, hashed_password)


async def get_user(email: str):
    email = email.strip().lower()
    logger.debug(f"Querying for for user with email: {email}")

    query = users_table.select().where(
        sqlalchemy.func.lower(sqlalchemy.func.trim(users_table.c.email)) == email
    )
    return await database.fetch_one(query)


async def authenticate_user(email: str, password: str):
    user = await get_user(email)
    if not user:
        logger.warning(f"Authentication failed: User not found for email: {email}")
        raise credentials_exception

    if not verify_password(password, user["hashed_password"]):
        logger.warning(f"Authentication failed: Inavlid password for email:{email}")
        raise credentials_exception

    logger.info("Authentication successful")
    return user


SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=60)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def create_refresh_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(days=31)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        email = payload.get("sub")

        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject"
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await get_user(email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    return user


async def get_current_user_from_refresh_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await get_user(email=email)
    if user is None:
        raise credentials_exception

    if not verify_password(token, user["hashed_refresh_token"]):
        raise credentials_exception

    return user
