import logging
import sqlalchemy
from datetime import date
from fastapi import APIRouter, Depends

from ..database import database, mess_menu_items_table
from ..models.user import User
from ..security import get_current_user

router = APIRouter()

logger = logging.getLogger(__name__)

@router.get("/my-menu")
async def get_my_menu(current_user: User = Depends(get_current_user)):
    logging.info(f"Fetching today's menu for user: {current_user.email}")

    today=date.today()
    day_of_week = today.strftime("%A").lower()
    user_cycle = current_user.mess_cycle

    query = (
        mess_menu_items_table.select().where(
            sqlalchemy.and_(
                mess_menu_items_table.c.cycle_type == user_cycle,
                mess_menu_items_table.c.day_of_week == day_of_week,
            )
        )
    )

    results = await database.fetch_all(query)

    meals = {row["meal_type"]: row["description"] for row in results}

    return {
        "date": today,
        "day_of_week": day_of_week,
        "cycle": user_cycle,
        "meals": meals
    }

    