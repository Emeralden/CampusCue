import logging
import sqlalchemy
from fastapi import APIRouter, Depends, status, Query, HTTPException
from datetime import datetime
from typing import List

from ..database import database, schedule_overrides_table, schedule_items_table, user_schedule_table
from ..models.schedule import ScheduleOverride, ScheduleItem, CourseSubscription
from ..models.user import User
from ..security import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/subscriptions", status_code=status.HTTP_204_NO_CONTENT)
async def update_course_subscriptions(
    subscription_data: CourseSubscription,
    current_user: User = Depends(get_current_user),
):
    logger.info(f"User {current_user.email} updating course subscriptions.")

    requested_ids = subscription_data.schedule_item_ids
    if not requested_ids:
        wipe_query = user_schedule_table.delete().where(user_schedule_table.c.user_id == current_user.id)
        await database.execute(wipe_query)
        return

    select_query = schedule_items_table.select().where(schedule_items_table.c.id.in_(requested_ids))
    selected_courses = await database.fetch_all(select_query)

    sorted_courses = sorted(selected_courses, key=lambda c: (c['day_of_week'], c['start_time']))
    for i in range(len(sorted_courses) - 1):
        current_course = sorted_courses[i]
        next_course = sorted_courses[i+1]
        
        if current_course['day_of_week'] == next_course['day_of_week'] and next_course['start_time'] < current_course['end_time']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Schedule clash detected between {current_course['name']} and {next_course['name']}."
            )

    wipe_query = user_schedule_table.delete().where(user_schedule_table.c.user_id == current_user.id)
    await database.execute(wipe_query)

    new_subscriptions = [
        {"user_id": current_user.id, "schedule_item_id": course_id}
        for course_id in requested_ids
    ]
    insert_query = user_schedule_table.insert()
    await database.execute_many(query=insert_query, values=new_subscriptions)

    return

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

@router.get("/overrides/{date_str}")
async def get_schedule_override(
    date_str: str,
    current_user: User = Depends(get_current_user),
):
    target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    
    query = schedule_overrides_table.select().where(
        sqlalchemy.and_(
            schedule_overrides_table.c.user_id == current_user.id,
            schedule_overrides_table.c.override_date == target_date,
        )
    )
    return await database.fetch_one(query)

@router.delete("/overrides/{date_str}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_schedule_override(
    date_str: str,
    current_user: User = Depends(get_current_user),
):
    logger.info(f"User {current_user.email} deleting override for {date_str}")
    
    override_date = datetime.strptime(date_str, "%Y-%m-%d").date()

    delete_query = schedule_overrides_table.delete().where(
        sqlalchemy.and_(
            schedule_overrides_table.c.user_id == current_user.id,
            schedule_overrides_table.c.override_date == override_date,
        )
    )

    await database.execute(delete_query)

    return None

@router.get("/my-day", response_model=List[ScheduleItem])
async def get_my_daily_schedule(
    date_str: str = Query(..., alias="date"),
    current_user: User = Depends(get_current_user)
):
    target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    
    override_query = schedule_overrides_table.select().where(
        sqlalchemy.and_(
            schedule_overrides_table.c.user_id == current_user.id,
            schedule_overrides_table.c.override_date == target_date,
        )
    )
    active_override = await database.fetch_one(override_query)
    
    day_to_fetch = target_date.strftime("%A").lower()
    if active_override:
        day_to_fetch = active_override["target_day"]
        logger.debug(f"Override found! Fetching schedule for {day_to_fetch.upper()}")
    
    logger.info(f"Fetching V2 schedule for user {current_user.email} on day {day_to_fetch}")

    core_query = schedule_items_table.select().where(
        sqlalchemy.and_(
            schedule_items_table.c.day_of_week == day_to_fetch,
            schedule_items_table.c.course_type == "core"
        )
    )
    
    subscribed_query = (
        schedule_items_table.select()
        .join(user_schedule_table, schedule_items_table.c.id == user_schedule_table.c.schedule_item_id)
        .where(
            sqlalchemy.and_(
                user_schedule_table.c.user_id == current_user.id,
                schedule_items_table.c.day_of_week == day_to_fetch
            )
        )
    )
    
    core_items = await database.fetch_all(core_query)
    subscribed_items = await database.fetch_all(subscribed_query)

    full_schedule = sorted(core_items + subscribed_items, key=lambda item: item["start_time"])
    
    return full_schedule

@router.get("", response_model=List[ScheduleItem])
async def get_master_schedule(day: str):
    logger.info("Fetching Full schedule...")

    query = (
        schedule_items_table.select()
        .where(schedule_items_table.c.day_of_week == day)
        .order_by(schedule_items_table.c.start_time)
    )
    
    return await database.fetch_all(query)