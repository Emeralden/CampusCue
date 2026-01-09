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
        "menu_type": "veg",
        "description": "Poori + Potato Onion Masala"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "monday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Soya keema + Pudina Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "monday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Panner Jalfrezi + Pudina Chutney + Fruit Custard"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "tuesday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "Onion Uttapam + Sambhar + Peanut Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "tuesday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Kadi Onion Pakoda + Onion Aloo Choka + Gongura Dal + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "tuesday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Kundru Onion Garlic dry with peanuts + tomato soup + Moong Dal Halwa"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "wednesday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "Aloo onion Paratha (2 + 1) + Pudina Chutney & Sauce + curd"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "wednesday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Lassoni corn palak curry + Tomato+lasson Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "wednesday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Palak Panner + Lasun Chutney + Gulab Jamun (2 pcs)"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "thursday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "Idli + Vada + Coconut Chutney + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "thursday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Brocolli + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "thursday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Aloo Methi + Palak + Rajma + hot and sour soup + sewai"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "friday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "Poha + White Matar Curry + Onion cut + Tomato cut + Aaloo Sandwich"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "friday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Lal Bhaji + Lasun Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "friday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Shahi Paneer + Lasun Chutney + Jalebi"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "saturday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "Ragi Dosa + Peanut Chutney + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "saturday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Chole + Veg Pulao + Bhature + Lasun Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "saturday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Mixed Veg Jalfrezi + hot and sour soup + Kheer"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "sunday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "Vegetable Pasta + Aaloo Sandwich"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "sunday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Mixed veg + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "sunday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Paneer Dum Biryani + 1 additional scoop rice + Onion Raita (150ml) + Gravy + Sahi Tukda"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "monday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Poori + Potato Onion Masala"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "monday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Soya keema + Pudina Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "monday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Panner Jalfrezi + Pudina Chutney + Fruit Custard"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "tuesday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Onion Uttapam + Sambhar + Peanut Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "tuesday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Kadi Onion Pakoda + Onion Aloo Choka + Gongura Dal + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "tuesday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Kundru Onion Garlic dry with peanuts + tomato soup + Moong Dal Halwa"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "wednesday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Aloo onion Paratha (2 + 1) + Pudina Chutney & Sauce + curd"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "wednesday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Lassoni corn palak curry + Tomato+lasson Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "wednesday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Butter Chicken + Lasun Chutney + Gulab Jamun (2 pcs)"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "thursday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Idli + Vada + Coconut Chutney + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "thursday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Brocolli + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "thursday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Aloo Methi + Palak + Rajma + hot and sour soup + sewai"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "friday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Poha + White Matar Curry + Onion cut + Tomato cut + Aaloo Sandwich"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "friday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Lal Bhaji + Lasun Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "friday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Egg Curry + Lasun Chutney + Balushahi"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "saturday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Ragi Dosa + Peanut Chutney + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "saturday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Chole + Gongura Dal + Veg Pulao + Bhature + Lasun Chutney"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "saturday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Mixed Veg Jalfrezi + hot and sour soup + Kheer"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "sunday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Vegetable Pasta + Aaloo Sandwich"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "sunday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Mixed veg + Sambhar"
    },
    {
        "cycle_type": "weeks_1_3",
        "day_of_week": "sunday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Chicken Dum Biryani + 1 additional scoop + Onion raita (150ml) + Gravy + Sahi Tukda"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "monday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "Masala dosa (2+1) + Coconut Chutney + Sambhar"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "monday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Lauki Chana Dal + Dal Makhni + tomato+lasson chutney"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "monday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Mutter panner + pudina chutney + Fruit Custard"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "tuesday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "Cauliflower Paratha + Curd"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "tuesday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Palak Chole + Sambhar"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "tuesday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Aloo Muttor+Tomato + Dal Makhni + Moong Dal Halwa"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "wednesday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "Poha + White Matar Curry + Onion cut + Tomato cut"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "wednesday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Aloo Matha + Lemon Coriander soup"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "wednesday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Palak Panner + manchow soup + Gulab Jamun (2 pcs)"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "thursday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "masala idli + Dhaniya Chutney"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "thursday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Sarso ka Saag + Sambhar"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "thursday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Mix Veg + Rajma + Lasun Chutney + Sahi tukda"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "friday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "Moong Dal Chilla + Mint Chutney + Black Chana Curry"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "friday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Aloo bhujia + Sambhar"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "friday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Kadai Paneer + Lemon Corriander soup + Jalebi"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "saturday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "Millet Dosa + Peanut Chutney + Sambhar + Aloo Sandwich"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "saturday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Chole + Veg Pulao + Bhature + pudina chutney"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "saturday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "soyabean curry + Kheer"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "sunday",
        "meal_type": "breakfast",
        "menu_type": "veg",
        "description": "Millet Dosa + Peanut Chutney + Sambhar"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "sunday",
        "meal_type": "lunch",
        "menu_type": "veg",
        "description": "Mixed Veg + pudina chutney"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "sunday",
        "meal_type": "dinner",
        "menu_type": "veg",
        "description": "Paneer Dum Biryani + 1 additional scoop + Onion raita (150ml) + Gravy + Gajar Halwa"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "monday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Masala dosa (2+1) + Coconut Chutney + Sambhar"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "monday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Lauki Chana Dal + Dal Makhni + tomato+lasson chutney"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "monday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Mutter panner + pudina chutney + Fruit Custard"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "tuesday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Cauliflower Paratha + Curd"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "tuesday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Palak Chole + Sambhar"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "tuesday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Aloo Muttor+Tomato + Dal Makhni + Moong Dal Halwa"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "wednesday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Poha + White Matar Curry + Onion cut + Tomato cut"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "wednesday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Aloo Matha + Lemon Coriander soup"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "wednesday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Pepper Chicken + Manchow soup + Gulab Jamun (2 pcs)"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "thursday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "masala idli + Dhaniya Chutney"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "thursday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Sarso ka Saag + Sambhar"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "thursday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Mix Veg + Rajma + Lasun Chutney + Sahi tukda"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "friday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Moong Dal Chilla + Mint Chutney + Black Chana Curry"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "friday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Aloo bhujia + Sambhar"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "friday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Fish fry + Curry + lemon coriander soup + Jalebi"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "saturday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Millet Dosa + Peanut Chutney + Sambhar + Aloo Sandwich"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "saturday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Chole + Veg Pulao + Bhature + pudina chutney"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "saturday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "soyabean curry + Kheer"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "sunday",
        "meal_type": "breakfast",
        "menu_type": "non_veg",
        "description": "Millet Dosa + Peanut Chutney + Sambhar"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "sunday",
        "meal_type": "lunch",
        "menu_type": "non_veg",
        "description": "Mixed Veg + pudina chutney"
    },
    {
        "cycle_type": "weeks_2_4",
        "day_of_week": "sunday",
        "meal_type": "dinner",
        "menu_type": "non_veg",
        "description": "Chicken Biryani(3 pcs~ 150 gm) + 1 additional scoop +Onion raita (150ml) + Gravy + Sahi tukda"
    }
]

SCHEDULE_DATA = [
    # Monday
    {"day_of_week": "monday", "item_type": "class", "name": "AST", "room": "L102", "start_time": time(8, 30), "end_time": time(9, 30)},
    {"day_of_week": "monday", "item_type": "class", "name": "Nuclear Physics", "room": "L102", "start_time": time(11, 30), "end_time": time(12, 30)},
    {"day_of_week": "monday", "item_type": "class", "name": "DIP", "room": "L102", "start_time": time(14, 30), "end_time": time(15, 30)},
    {"day_of_week": "monday", "item_type": "class", "name": "Leadership", "room": "L101", "start_time": time(15, 30), "end_time": time(16, 30)},
    
    # Tuesday
    {"day_of_week": "tuesday", "item_type": "lab", "name": "PE Lab", "room": "PoCo, ED1 Lvl-3", "start_time": time(14, 30), "end_time": time(17, 30)},
    
    # Wednesday
    {"day_of_week": "wednesday", "item_type": "class", "name": "Nuclear Physics", "room": "L102", "start_time": time(8, 30), "end_time": time(9, 30)},
    {"day_of_week": "wednesday", "item_type": "class", "name": "AST", "room": "L102", "start_time": time(9, 30), "end_time": time(10, 30)},
    {"day_of_week": "wednesday", "item_type": "class", "name": "DIP", "room": "L102", "start_time": time(14, 30), "end_time": time(15, 30)},
    
    # Thursday
    {"day_of_week": "thursday", "item_type": "lab", "name": "Control Lab", "room": "PoCo, ED1 Lvl-3", "start_time": time(9, 30), "end_time": time(12, 30)},
    {"day_of_week": "thursday", "item_type": "lab", "name": "Machines Lab", "room": "DREEM, ED1 Lvl-2", "start_time": time(14, 30), "end_time": time(17, 30)},
    
    # Friday
    {"day_of_week": "friday", "item_type": "class", "name": "AST", "room": "L102", "start_time": time(9, 30), "end_time": time(10, 30)},
    {"day_of_week": "friday", "item_type": "class", "name": "DIP", "room": "L102", "start_time": time(14, 30), "end_time": time(15, 30)},
    {"day_of_week": "friday", "item_type": "lab", "name": "Instrumentation Lab", "room": "SID, ED1 Lvl-3", "start_time": time(15, 30), "end_time": time(18, 30)},
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