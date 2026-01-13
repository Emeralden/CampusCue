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
    "description": "Poori + Potato Onion Masala + Coleslaw sandwich"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Soya keema"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Panner Jalfrezi + Fruit Custard"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Onion Uttapam+ Sambhar + Peanut Chutney"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Kadi Onion Pakoda + Onion Aloo + Gongura Dal + Pudina Chutney"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Kundru Onion Garlic dry with peanuts + Pudina Chutney + Moong Dal Halwa"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Aloo onion Paratha + Pudina Chutney & Sauce + curd"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Lassoni corn palak curry"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Palak Panner + Gulab Jamun"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "thursday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Idli+Vada+Coconut Chutney+Sambhar"
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
    "description": "Aloo Methi + Palak + Rajma + tomato soup + sewai"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Poha+ White Matar Curry + Onion cut + Tomato cut + Veg Corn Sandwich"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Lal Bhaji + Tomato+lasson Chutney"
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
    "description": "Chole + Veg Pulao + Bhature"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "saturday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Mixed Veg Jalfrezi + Dal Makhni + hot and sour soup + Kheer"
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
    "description": "Paneer Dum Biryani + 1 additional scoop rice+ Onion Raita + Gravy + Sahi Tukda"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Poori + Potato Onion Masala + Coleslaw sandwich"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Soya keema"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Panner Jalfrezi + Fruit Custard"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Onion Uttapam+ Sambhar + Peanut Chutney"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Kadi Onion Pakoda + Onion Aloo + Gongura Dal + Pudina Chutney"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Kundru Onion Garlic dry with peanuts + Pudina Chutney + Moong Dal Halwa"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Aloo onion Paratha + Pudina Chutney & Sauce + curd"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Lassoni corn palak curry"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Butter Chicken + Gulab Jamun"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "thursday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Idli+Vada+Coconut Chutney+Sambhar"
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
    "description": "Aloo Methi + Palak + Rajma + tomato soup + sewai"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Poha+ White Matar Curry + Onion cut + Tomato cut + Veg Corn Sandwich"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Lal Bhaji + Tomato+lasson Chutney"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Egg Curry + Lasun Chutney + Jalebi"
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
    "description": "Chole + Veg Pulao + Bhature"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "saturday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Mixed Veg Jalfrezi + Dal Makhni + hot and sour soup + Kheer"
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
    "description": "Chicken Dum Biryani + 1 additional scoop + Onion raita + Gravy + Sahi Tukda"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Poori + Potato Onion Masala"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Lauki Chana Dal + Dal Makhni"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Mutter panner + Fruit Custard"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Masala dosa + Coconut Chutney Sambhar + Bombay Sandwich"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Palak Chole + tomato+lasson chutney"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Aloo Muttor+Tomato + pudina chutney + Moong Dal Halwa"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Cauliflower Paratha + Green Chutney + Curd"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Aloo Matha"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Palak Panner + Gulab Jamun"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "thursday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Poha+ White Matar Curry + Onion cut + Tomato cut"
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
    "description": "Mix Veg + Rajma + manchow soup + Sahi tukda"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "friday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "masala idli+Dhaniya Chutney + Veg Corn Sandwich"
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
    "description": "Kadai Paneer + Lasun Chutney + Jalebi"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "saturday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Moong Dal Chilla + Mint Chutney + Black Chana Curry + Aloo Sandwich"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "saturday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Chole + Veg Pulao + Bhature"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "saturday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "soyabean curry + Lemon Corriander soup + Kheer"
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
    "description": "Paneer Dum Biryani + 1 additional scoop + Onion raita + Gravy + Gajar Halwa"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Poori + Potato Onion Masala"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Lauki Chana Dal + Dal Makhni + Tomato soup"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Mutter panner + Fruit Custard"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Masala dosa + Coconut Chutney Sambhar + Bombay Sandwich"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Palak Chole + tomato+lasson chutney"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Aloo Muttor+Tomato + pudina chutney + Moong Dal Halwa"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Cauliflower Paratha + Green Chutney + Curd"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Aloo Matha + Lemon Corriander soup"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Pepper Chicken + Gulab Jamun"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "thursday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Poha+ White Matar Curry + Onion cut + Tomato cut"
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
    "description": "Mix Veg + Rajma + Manchow soup + Gajar Halwa"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "friday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "masala idli+Dhaniya Chutney + Veg Corn Sandwich"
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
    "description": "Fish fry + Curry + Lasun Chutney + Jalebi"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "saturday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Moong Dal Chilla + Mint Chutney + Black Chana Curry + Aloo Sandwich"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "saturday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Chole + Veg Pulao + Bhature"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "saturday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "soyabean curry + lemon corriander soup + Kheer"
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
    "description": "Chicken Biryani + 1 additional scoop +Onion raita + Gravy + Sahi tukda"
  }
]

SCHEDULE_DATA = [
    # Monday
    {"day_of_week": "monday", "item_type": "class", "course_type": "core", "name": "AST", "room": "L102", "start_time": time(8, 30), "end_time": time(9, 30)},
    {"day_of_week": "monday", "item_type": "class", "course_type": "elective", "name": "Nuclear Physics", "room": "L102", "start_time": time(11, 30), "end_time": time(12, 30)},
    {"day_of_week": "monday", "item_type": "class", "course_type": "core", "name": "DIP", "room": "L102", "start_time": time(14, 30), "end_time": time(15, 30)},
    {"day_of_week": "monday", "item_type": "class", "course_type": "la", "name": "Leadership", "room": "L101", "start_time": time(15, 30), "end_time": time(16, 30)},
    {"day_of_week": "monday", "item_type": "class", "course_type": "elective", "name": "Power Quality", "room": "L102", "start_time": time(16, 30), "end_time": time(17, 30)},
    
    # Tuesday
    {"day_of_week": "tuesday", "item_type": "lab", "course_type": "core", "name": "PE Lab", "room": "PoCo, ED1 Lvl-3", "start_time": time(14, 30), "end_time": time(17, 30)},
    
    # Wednesday
    {"day_of_week": "wednesday", "item_type": "class", "course_type": "elective", "name": "Nuclear Physics", "room": "L102", "start_time": time(8, 30), "end_time": time(9, 30)},
    {"day_of_week": "wednesday", "item_type": "class", "course_type": "core", "name": "AST", "room": "L102", "start_time": time(9, 30), "end_time": time(10, 30)},
    {"day_of_week": "wednesday", "item_type": "class", "course_type": "la", "name": "Macroeconomics", "room": "L101", "start_time": time(12, 30), "end_time": time(13, 30)},
    {"day_of_week": "wednesday", "item_type": "class", "course_type": "core", "name": "DIP", "room": "L102", "start_time": time(14, 30), "end_time": time(15, 30)},
    {"day_of_week": "wednesday", "item_type": "class", "course_type": "elective", "name": "Power Quality", "room": "L102", "start_time": time(16, 30), "end_time": time(17, 30)},
    
    # Thursday
    {"day_of_week": "thursday", "item_type": "lab", "course_type": "core", "name": "Control Lab", "room": "PoCo, ED1 Lvl-3", "start_time": time(9, 30), "end_time": time(12, 30)},
    {"day_of_week": "thursday", "item_type": "lab", "course_type": "core", "name": "Machines Lab", "room": "DREEM, ED1 Lvl-2", "start_time": time(14, 30), "end_time": time(17, 30)},
    
    # Friday
    {"day_of_week": "friday", "item_type": "class", "course_type": "la", "name": "Macroeconomics", "room": "L101", "start_time": time(8, 30), "end_time": time(9, 30)},
    {"day_of_week": "friday", "item_type": "class", "course_type": "core", "name": "AST", "room": "L102", "start_time": time(9, 30), "end_time": time(10, 30)},
    {"day_of_week": "friday", "item_type": "class", "course_type": "elective", "name": "Power Quality", "room": "L102?", "start_time": time(11, 30), "end_time": time(12, 30)},
    {"day_of_week": "friday", "item_type": "class", "course_type": "core", "name": "DIP", "room": "L102", "start_time": time(14, 30), "end_time": time(15, 30)},
    {"day_of_week": "friday", "item_type": "lab", "course_type": "core", "name": "Instrumentation Lab", "room": "SID, ED1 Lvl-3", "start_time": time(15, 30), "end_time": time(18, 30)},
]

async def seed_mess_menu():
    print("Starting mess menu seeding process...")
    wipe_query = mess_menu_items_table.delete()
    await database.execute(wipe_query)

    insert_query = mess_menu_items_table.insert()
    await database.execute_many(query=insert_query, values=MENU_DATA)
        
    print("Mess menu seeding successful!")

async def seed_schedule():
    check_query = schedule_items_table.select().limit(1)
    existing_item = await database.fetch_one(check_query)
    
    if existing_item:
        print("Schedule already exists. Skipping to protect user subscriptions.")
        return

    print("Starting schedule seeding process...")
    insert_query = schedule_items_table.insert()
    await database.execute_many(query=insert_query, values=SCHEDULE_DATA)
    print("Schedule seeded.")

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
