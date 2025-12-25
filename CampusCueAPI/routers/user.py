import logging
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from ..database import database, users_table
from ..models.user import User, UserIn
from ..models.mess import MessPreferenceUpdate
from datetime import date
from ..security import get_user, get_password_hash, authenticate_user, create_access_token, get_current_user

router = APIRouter()

logger = logging.getLogger(__name__)

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserIn):
    """
    Registers a new user in the system.
    """
    if await get_user(user.email):
        logger.warning(f"Registartion attempt for existing email:{user.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )
    
    hashed_password = get_password_hash(user.password)

    query = users_table.insert().values(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        mess_cycle=user.mess_cycle
    )

    logger.info(f"Creating new user: {user.email}")
    await database.execute(query)

    return {"detail": "User created successfully!"}


@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or Password",
            headers={"WWW-Authenticate":"Bearer"}
        )
    
    access_token = create_access_token(data={"sub": user["email"]})

    return {"access_token":access_token, "token_type":"bearer"}


@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me/mess-preference", response_model=User)
async def update_mess_preference(
    preference_update: MessPreferenceUpdate,
    current_user: User = Depends(get_current_user)
):
    logger.info(f"User {current_user.email} updating mess cycle preference to {preference_update.mess_cycle}")

    update_query = (
        users_table.update()
        .where(users_table.c.id == current_user.id)
        .values(
            mess_cycle=preference_update.mess_cycle
        )

    )

    await database.execute(update_query)

    return await get_user(current_user.email)
