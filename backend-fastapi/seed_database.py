import asyncio
import json
import os
import sys

# Add this folder to path so we can import database.py directly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import database, mess_menu_items_table, schedule_items_table

SHARED_DIR = os.path.join(os.path.dirname(__file__), '..', 'shared')

with open(os.path.join(SHARED_DIR, 'menu_data.json'), 'r') as f:
    MENU_DATA = json.load(f)

with open(os.path.join(SHARED_DIR, 'schedule_data.json'), 'r') as f:
    SCHEDULE_DATA = json.load(f)


async def seed_mess_menu():
    print("Starting mess menu seeding process...")
    await database.execute(mess_menu_items_table.delete())
    await database.execute_many(query=mess_menu_items_table.insert(), values=MENU_DATA)
    print(f"Mess menu seeding successful! ({len(MENU_DATA)} items)")


async def seed_schedule():
    print("Performing schedule sync...")
    import sqlalchemy
    for item_data in SCHEDULE_DATA:
        existing = await database.fetch_one(
            schedule_items_table.select().where(
                sqlalchemy.and_(
                    schedule_items_table.c.name == item_data["name"],
                    schedule_items_table.c.day_of_week == item_data["day_of_week"],
                    schedule_items_table.c.start_time == item_data["start_time"],
                )
            )
        )
        if existing:
            await database.execute(
                schedule_items_table.update()
                .where(schedule_items_table.c.id == existing["id"])
                .values(**item_data)
            )
        else:
            await database.execute(schedule_items_table.insert().values(**item_data))
    print(f"Schedule sync complete. ({len(SCHEDULE_DATA)} items)")


async def main():
    print("Starting seeding...")
    await database.connect()
    try:
        await seed_mess_menu()
        await seed_schedule()
    except Exception as e:
        print(f"An error occurred: {e}")
        raise
    finally:
        await database.disconnect()
        print("Seeding Complete!")


if __name__ == "__main__":
    asyncio.run(main())
