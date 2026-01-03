import databases
import sqlalchemy

from .config import settings

metadata = sqlalchemy.MetaData()

users_table = sqlalchemy.Table (
    "users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("email", sqlalchemy.String, unique=True, nullable=False),
    sqlalchemy.Column("full_name", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("hashed_password", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("hashed_refresh_token", sqlalchemy.String, nullable=True),
    sqlalchemy.Column("mess_cycle", sqlalchemy.String, server_default="week_2_4", nullable=False),
)

mess_menu_items_table = sqlalchemy.Table (
    "mess_menu_tems",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("cycle_type", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("day_of_week", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("meal_type", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("description", sqlalchemy.Text, nullable=False),
    
    sqlalchemy.UniqueConstraint(
        "cycle_type", "day_of_week", "meal_type", name="uq_mess_menu_item"  
        )
    )

schedule_items_table = sqlalchemy.Table (
    "schedule_items",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("day_of_week", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("item_type", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("name", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("room", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("start_time", sqlalchemy.Time, nullable=False),
    sqlalchemy.Column("end_time", sqlalchemy.Time, nullable=False),
)

schedule_overrides_table = sqlalchemy.Table (
    "schedule_overrides",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("user_id", sqlalchemy.ForeignKey("users.id"), nullable=False),
    sqlalchemy.Column("override_date", sqlalchemy.Date, nullable=False),
    sqlalchemy.Column("target_day", sqlalchemy.String, nullable=False),
    sqlalchemy.UniqueConstraint("user_id", "override_date", name="uq_user_override_date")
)

satisfaction_logs_table = sqlalchemy.Table (
    "Satisfaction Logs",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("user_id", sqlalchemy.ForeignKey("users.id"), nullable=False),
    sqlalchemy.Column("log_date", sqlalchemy.Date, nullable=False),
    sqlalchemy.Column("satisfaction_level", sqlalchemy.String, nullable=False),

    sqlalchemy.UniqueConstraint("user_id", "log_date", name="uq_user_log_date")
)

connect_args = {}
pool_args = {}

if "sqlite" in settings.database_url:
    print("Running in SQLite mode.")
else:
    pool_args["min_size"] = 1
    pool_args["max_size"] = 97
    print("Running in PostgreSQL mode.")


engine = sqlalchemy.create_engine(
    settings.database_url,
    connect_args=connect_args,
)

metadata.create_all(engine)

database = databases.Database(
    settings.database_url,
    **pool_args
)