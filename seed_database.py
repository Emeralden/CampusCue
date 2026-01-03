import asyncio
import os
import sys
from typing import List, Dict
from datetime import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from CampusCueAPI.database import database, mess_menu_items_table, schedule_items_table

MENU_DATA: List[Dict[str, str]] = [
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "monday",
        "meal_type": "breakfast",
        "description": "Idli and Vada + Coconut Chatani + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "monday",
        "meal_type": "lunch",
        "description": "Gatte ki Sabzi + Rasam"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "monday",
        "meal_type": "dinner",
        "description": "Soya Chunks + Pudina Chutney + Gajar ka Halwa"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "tuesday",
        "meal_type": "breakfast",
        "description": "Paneer Paratha + Chatani"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "tuesday",
        "meal_type": "lunch",
        "description": "Kadi-Onion Pakoda + Onion Aloo Chokha + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "tuesday",
        "meal_type": "dinner",
        "description": "Kundru Onion Garlic Dry with Peanuts + Moong Dal Halwa"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "wednesday",
        "meal_type": "breakfast",
        "description": "Onion Uttapam + Sambhar + Peanut Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "wednesday",
        "meal_type": "lunch",
        "description": "Lassoni Corn Plak Curry"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "wednesday",
        "meal_type": "dinner",
        "description": "Palak Paneer + Gulab Jamun (2 pcs)"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "thursday",
        "meal_type": "breakfast",
        "description": "Aloo Onion Paratha (2+1) + Pudina chutney & sauce + Curd"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "thursday",
        "meal_type": "lunch",
        "description": "Navratan Korma + Rajma + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "thursday",
        "meal_type": "dinner",
        "description": "Garlic Roasted Sweet Potato, Carrot and Bean + Pudina Chutney + Sewai"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "friday",
        "meal_type": "breakfast",
        "description": "Poha + White Matar Curry + Onion cut + Tomato cut + Aaloo Sandwich + Green Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "friday",
        "meal_type": "lunch",
        "description": "Lal Bhaji + Gongura Dal + Lasun Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "friday",
        "meal_type": "dinner",
        "description": "Shahi Paneer + Balushahi"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "saturday",
        "meal_type": "breakfast",
        "description": "Ragi Dosa + Peanut Chutney + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "saturday",
        "meal_type": "lunch",
        "description": "Chole + Rajma + Veg Pulao + Bhature + Lasun Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "saturday",
        "meal_type": "dinner",
        "description": "Mixed Veg Jalfrezi + Kheer"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "sunday",
        "meal_type": "breakfast",
        "description": "Methi/Gobi Paratha + Curd + Green Chatani"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "sunday",
        "meal_type": "lunch",
        "description": "Carrot + Peas + Gongura Dal + Lasun Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "sunday",
        "meal_type": "dinner",
        "description": "Paneer Dum Biryani + 1 additional scoop rice + Onion Raita (150ml) + Gravy + Ice Cream"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "monday",
        "meal_type": "breakfast",
        "description": "Samosa/Kachori + Chole/Alloo ka Jhool"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "monday",
        "meal_type": "lunch",
        "description": "Lauki Chana Dal + Rasam"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "monday",
        "meal_type": "dinner",
        "description": "Soya Keema + Rajma + Pudina Chutney + Fruit Custard"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "tuesday",
        "meal_type": "breakfast",
        "description": "Cauliflower Paratha + Green Chutney + Curd"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "tuesday",
        "meal_type": "lunch",
        "description": "Palak Chole + Lasun Chutney"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "tuesday",
        "meal_type": "dinner",
        "description": "Aloo Matha + Moong Dal Halwa"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "wednesday",
        "meal_type": "breakfast",
        "description": "Suji Upma + Peanut Chutney"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "wednesday",
        "meal_type": "lunch",
        "description": "Kathal ke sabji + Sambhar"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "wednesday",
        "meal_type": "dinner",
        "description": "Afgani Paneer + Gulab Jamun (2 pcs)"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "thursday",
        "meal_type": "breakfast",
        "description": "Poha + White Matar Curry + Onion cut + Tomato cut"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "thursday",
        "meal_type": "lunch",
        "description": "Kadi palak + Aloo bhujia + Gongura Dal + Lasun chutney"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "thursday",
        "meal_type": "dinner",
        "description": "French Bean - Carrot Dry + Lasun Chutney + Sewai"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "friday",
        "meal_type": "breakfast",
        "description": "Masala Idli + Chatni + Aaloo Sandwich + Green Chutney"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "friday",
        "meal_type": "lunch",
        "description": "Chaulai Saag"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "friday",
        "meal_type": "dinner",
        "description": "Kadai Paneer + Jalebi"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "saturday",
        "meal_type": "breakfast",
        "description": "Paneer Paratha + Chatani"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "saturday",
        "meal_type": "lunch",
        "description": "Lauki Kofta + Veg Pulao + Bhature"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "saturday",
        "meal_type": "dinner",
        "description": "(Aalu+Matar+Gobi) Dry + Kheer"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "sunday",
        "meal_type": "breakfast",
        "description": "Millet Dosa + Peanut Chutney + Sambhar"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "sunday",
        "meal_type": "lunch",
        "description": "Mix Veg"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "sunday",
        "meal_type": "dinner",
        "description": "Paneer Dum Biryani + 1 additional scoop + Onion raita (150ml) + Gravy + Ice Cream"
    }
]

SCHEDULE_DATA = [
    # Monday
    {"day_of_week": "monday", "item_type": "class", "name": "AST", "room": "L104", "start_time": time(8, 30), "end_time": time(9, 30)},
    {"day_of_week": "monday", "item_type": "lab", "name": "Machines Lab", "room": "DREEM, ED1 Lvl-1", "start_time": time(9, 30), "end_time": time(12, 30)},
    {"day_of_week": "monday", "item_type": "class", "name": "DIP", "room": "L102", "start_time": time(14, 30), "end_time": time(15, 30)},
    
    # Tuesday
    {"day_of_week": "tuesday", "item_type": "lab", "name": "PE Lab", "room": "LAB", "start_time": time(14, 30), "end_time": time(17, 30)},
    
    # Wednesday
    {"day_of_week": "wednesday", "item_type": "class", "name": "AST", "room": "L104", "start_time": time(9, 30), "end_time": time(10, 30)},
    {"day_of_week": "wednesday", "item_type": "class", "name": "Macroeconomics", "room": "L101", "start_time": time(12, 30), "end_time": time(13, 30)},
    {"day_of_week": "wednesday", "item_type": "class", "name": "DIP", "room": "L102", "start_time": time(14, 30), "end_time": time(15, 30)},
    
    # Thursday
    {"day_of_week": "thursday", "item_type": "lab", "name": "Control Lab", "room": "PoCo, ED1 Lvl-3", "start_time": time(9, 30), "end_time": time(12, 30)},
    {"day_of_week": "thursday", "item_type": "lab", "name": "Instrumentation Lab", "room": "SID, ED1 Lvl-2", "start_time": time(14, 30), "end_time": time(17, 30)},
    
    # Friday
    {"day_of_week": "friday", "item_type": "class", "name": "Macroeconomics", "room": "L101", "start_time": time(8, 30), "end_time": time(9, 30)},
    {"day_of_week": "friday", "item_type": "class", "name": "AST", "room": "L104", "start_time": time(9, 30), "end_time": time(10, 30)},
    {"day_of_week": "friday", "item_type": "class", "name": "DIP", "room": "L102", "start_time": time(14, 30), "end_time": time(15, 30)},
]


async def seed_mess_menu():
    print("Starting mess menu seeding process...")
    wipe_query = mess_menu_items_table.delete()
    await database.execute(wipe_query)

    insert_query = mess_menu_items_table.insert()
    await database.execute_many(query=insert_query, values=MENU_DATA)
        
    print("Mess menu seeding successful!")

async def seed_schedule():
    print("Starting schedule seeding process...")
    wipe_query = schedule_items_table.delete()
    await database.execute(wipe_query)

    insert_query = schedule_items_table.insert()
    await database.execute_many(query=insert_query, values=SCHEDULE_DATA)
        
    print("Schedule seeding successful!")

async def main():
    print("Starting seeding...")
    await database.connect()
    try:
        await seed_mess_menu()
        await seed_schedule()
    except Exception as e:
        print(f"An error occured: {e}")
    finally:
        await database.disconnect()
        print("Seeding Complete!")

if __name__ == "__main__":
    asyncio.run(main())