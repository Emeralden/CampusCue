import logging
import sqlalchemy
from fastapi import APIRouter, Depends, status
from typing import List

from ..database import database, satisfaction_logs_table
from ..models.satisfaction import SatisfactionLogCreate, SatisfactionLog
from ..models.user import User
from ..security import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("", response_model=SatisfactionLog, status_code=status.HTTP_201_CREATED)
async def create_or_update_satisfaction_log(
    log_data: SatisfactionLogCreate,
    current_user: User = Depends(get_current_user),
):
    logger.info(f"User {current_user.email} logging satisfaction for {log_data.log_date}")

    find_query = satisfaction_logs_table.select().where(
        sqlalchemy.and_(
            satisfaction_logs_table.c.user_id == current_user.id,
            satisfaction_logs_table.c.log_date == log_data.log_date,
        )
    )
    existing_log = await database.fetch_one(find_query)

    if existing_log:
        logger.debug("Found existing log, updating.")
        update_query = (
            satisfaction_logs_table.update()
            .where(satisfaction_logs_table.c.id == existing_log["id"])
            .values(satisfaction_level=log_data.satisfaction_level.value)
        )
        await database.execute(update_query)
        return await database.fetch_one(find_query)
    
    else:
        logger.debug("No existing log found, creating new one.")
        insert_query = satisfaction_logs_table.insert().values(
            user_id=current_user.id,
            log_date=log_data.log_date,
            satisfaction_level=log_data.satisfaction_level.value,
        )
        new_log_id = await database.execute(insert_query)
        return {
            "id": new_log_id,
            "user_id": current_user.id,
            **log_data.model_dump(),
        }


@router.get("/history", response_model=List[SatisfactionLog])
async def get_satisfaction_history(
    current_user: User = Depends(get_current_user),
):
    logger.info(f"Fetching satisfaction history for user {current_user.email}")

    query = (
        satisfaction_logs_table.select()
        .where(satisfaction_logs_table.c.user_id == current_user.id)
        .order_by(satisfaction_logs_table.c.log_date.desc())
    )

    return await database.fetch_all(query)