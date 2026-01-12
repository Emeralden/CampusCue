import logging
import sqlalchemy
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from typing import List
from ..models.mess import MessMenuItem

from ..database import database, mess_menu_items_table
from ..models.user import User
from ..security import get_current_user

router = APIRouter()

logger = logging.getLogger(__name__)

@router.get("/my-menu")
async def get_my_menu(
    date_str: str = Query(..., alias="date"),
    current_user: User = Depends(get_current_user),
    ):
    target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    logger.info(f"Fetching menu for user {current_user.email} for date {target_date}")

    day_of_week = target_date.strftime("%A").lower()
    user_cycle = current_user.mess_cycle
    user_diet = current_user.diet_type

    query = (
        mess_menu_items_table.select().where(
            sqlalchemy.and_(
                mess_menu_items_table.c.cycle_type == user_cycle,
                mess_menu_items_table.c.day_of_week == day_of_week,
                mess_menu_items_table.c.menu_type == user_diet
            )
        )
    )

    results = await database.fetch_all(query)

    meals = {row["meal_type"]: row["description"] for row in results}

    return {
        "date": target_date,
        "day_of_week": day_of_week,
        "cycle": user_cycle,
        "meals": meals
    }


@router.get("", response_model=List[MessMenuItem])
async def get_full_menu_by_cycle(
    cycle: str,
    current_user: User = Depends(get_current_user)
):
    logger.info(f"Fetching full PERSONALIZED menu for cycle: {cycle} for user {current_user.email}")

    query = mess_menu_items_table.select().where(
        sqlalchemy.and_(
            mess_menu_items_table.c.cycle_type == cycle,
            mess_menu_items_table.c.menu_type == current_user.diet_type 
        )
    )

    return await database.fetch_all(query)