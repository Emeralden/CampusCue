import logging
import sqlalchemy
from fastapi import APIRouter, Depends, status

from ..database import database, schedule_overrides_table, schedule_items_table
from ..models.schedule import ScheduleOverride
from ..models.user import User
from ..security import get_current_user
from datetime import date

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/overrides", status_code=status.HTTP_201_CREATED)
async def create_schedule_override(
    override_data: ScheduleOverride,
    current_user: User = Depends(get_current_user)
):
    logger.info(f"User {current_user.email} creating/updating override for {override_data.override_date}")

    find_query = schedule_overrides_table.select().where(
        sqlalchemy.and_(schedule_overrides_table.c.user_id == current_user.id,
        schedule_overrides_table.c.override_date == override_data.override_date
        )
    )

    existing_override = await database.fetch_one(find_query)

    if existing_override:

        logger.info("Found existing override. Updating...")

        update_query = schedule_overrides_table.update().where(
            schedule_overrides_table.c.id == existing_override["id"]).values(
                target_day=override_data.target_day)
        
        await database.execute(update_query)

        return {**dict(existing_override), "target_day": override_data.target_day}

    else:
        logger.debug("No existing override found. Creating...")
        insert_query = schedule_overrides_table.insert().values(
            user_id=current_user.id,
            override_date=override_data.override_date,
            target_day=override_data.target_day
        )
        new_override_id = await database.execute(insert_query)
        return {"id": new_override_id, **override_data.model_dump(), "user_id": current_user.id}
    
@router.get("/my-day")
async def get_my_daily_schedule(
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    logger.info("fetching schedule for User {current_user.email} for {today}")

    override_query = schedule_overrides_table.select().where(
        sqlalchemy.and_(
            schedule_overrides_table.c.user_id == current_user.id,
            schedule_overrides_table.c.override_date == today,
        )
    )

    active_override = await database.fetch_one(override_query)

    day_to_fetch = today.strftime("%A").lower()
    has_override = False

    if active_override:
        day_to_fetch = active_override["target_day"]
        has_override = True
        logger.debug(f"Override found! Fetching schedule for {day_to_fetch.upper()}")
    

    schedule_query = (
        schedule_items_table.select()
        .where(schedule_items_table.c.day_of_week == day_to_fetch)
        .order_by(schedule_items_table.c.start_time)
    )

    items = await database.fetch_all(schedule_query)

    return {
        "date": today,
        "schedule_day": day_to_fetch,
        "has_override": has_override,
        "items": items
    }