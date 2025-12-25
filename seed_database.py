import asyncio
import os
import sys
from typing import List, Dict
from datetime import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from CampusCueAPI.database import database, mess_menu_items_table, schedule_items_table

MENU_DATA: List[Dict[str, str]] = [
    {"cycle_type": "weeks_1_3", "day_of_week": "monday", "meal_type": "breakfast", "description": "Poori + Potato Onion Masala"},
    {"cycle_type": "weeks_1_3", "day_of_week": "monday", "meal_type": "lunch", "description": "Soya Chunks Matar Curry"},
    {"cycle_type": "weeks_1_3", "day_of_week": "monday", "meal_type": "dinner", "description": "Bagara Baingan + Pudina Chutney + Fruit Custard"},
    
    {"cycle_type": "weeks_1_3", "day_of_week": "tuesday", "meal_type": "breakfast", "description": "Onion Uttapam + Sambhar + Peanut Chutney"},
    {"cycle_type": "weeks_1_3", "day_of_week": "tuesday", "meal_type": "lunch", "description": "Kadi-Onion Pakoda + Onion Aloo + Gongura Dal + Rasam"},
    {"cycle_type": "weeks_1_3", "day_of_week": "tuesday", "meal_type": "dinner", "description": "Kundru Onion Garlic Dry with Peanuts + Moong Dal Halwa"},
    
    {"cycle_type": "weeks_1_3", "day_of_week": "wednesday", "meal_type": "breakfast", "description": "Aloo Onion Paratha (2+1) + Pudina chutney & sauce + Curd"},
    {"cycle_type": "weeks_1_3", "day_of_week": "wednesday", "meal_type": "lunch", "description": "Lassoni Corn Plak Curry"},
    {"cycle_type": "weeks_1_3", "day_of_week": "wednesday", "meal_type": "dinner", "description": "Afgani Paneer + Gulab Jamun (2pcs)"},
    
    {"cycle_type": "weeks_1_3", "day_of_week": "thursday", "meal_type": "breakfast", "description": "Idli + Vada + Coconut Chutney + Sambhar"},
    {"cycle_type": "weeks_1_3", "day_of_week": "thursday", "meal_type": "lunch", "description": "Navratan Korma + Sambhar"},
    {"cycle_type": "weeks_1_3", "day_of_week": "thursday", "meal_type": "dinner", "description": "Garlic Roasted Sweet Potato, Carrot and Bean + Rajma + Sewai"},
    
    {"cycle_type": "weeks_1_3", "day_of_week": "friday", "meal_type": "breakfast", "description": "Poha + White Matar Curry + Onion cut + Tomato cut"},
    {"cycle_type": "weeks_1_3", "day_of_week": "friday", "meal_type": "lunch", "description": "Lal Bhaji + Rasam"},
    {"cycle_type": "weeks_1_3", "day_of_week": "friday", "meal_type": "dinner", "description": "Shahi Paneer + Lasun Chutney + Jalebi"},
    
    {"cycle_type": "weeks_1_3", "day_of_week": "saturday", "meal_type": "breakfast", "description": "Ragi Dosa + Peanut Chutney + Sambhar"},
    {"cycle_type": "weeks_1_3", "day_of_week": "saturday", "meal_type": "lunch", "description": "Chole + Veg Pulao + Bhature"},
    {"cycle_type": "weeks_1_3", "day_of_week": "saturday", "meal_type": "dinner", "description": "Mixed Veg Jalfrezi + Kheer"},
    
    {"cycle_type": "weeks_1_3", "day_of_week": "sunday", "meal_type": "breakfast", "description": "Vegetable Pasta + Tomato Ketchup + Aaloo Sandwich + Green Chutney"},
    {"cycle_type": "weeks_1_3", "day_of_week": "sunday", "meal_type": "lunch", "description": "Mixed Veg + Sambhar"},
    {"cycle_type": "weeks_1_3", "day_of_week": "sunday", "meal_type": "dinner", "description": "Paneer Dum Biryani + 1 additional scoop rice + Onion Raita (150ml) + Gravy + Ice Cream"},
    
    {"cycle_type": "weeks_2_4", "day_of_week": "monday", "meal_type": "breakfast", "description": "Masala Dosa (2+1) + Coconut Chutney + Sambhar"},
    {"cycle_type": "weeks_2_4", "day_of_week": "monday", "meal_type": "lunch", "description": "Lauki Chana Dal + Rasam"},
    {"cycle_type": "weeks_2_4", "day_of_week": "monday", "meal_type": "dinner", "description": "Soya Keema + Rajma + Pudina Chutney + Fruit Custard"},
    
    {"cycle_type": "weeks_2_4", "day_of_week": "tuesday", "meal_type": "breakfast", "description": "Suji Upma + Peanut Chutney"},
    {"cycle_type": "weeks_2_4", "day_of_week": "tuesday", "meal_type": "lunch", "description": "Palak Chole"},
    {"cycle_type": "weeks_2_4", "day_of_week": "tuesday", "meal_type": "dinner", "description": "Bhindi do Pyaza + Moong Dal Halwa"},
    
    {"cycle_type": "weeks_2_4", "day_of_week": "wednesday", "meal_type": "breakfast", "description": "Cauliflower Paratha + Green Chutney + Curd"},
    {"cycle_type": "weeks_2_4", "day_of_week": "wednesday", "meal_type": "lunch", "description": "Bitter Gourd Onion Fry + Sambhar"},
    {"cycle_type": "weeks_2_4", "day_of_week": "wednesday", "meal_type": "dinner", "description": "Paneer Jalfrezzi (limited) + Gulab Jamun (2 pcs)"},
    
    {"cycle_type": "weeks_2_4", "day_of_week": "thursday", "meal_type": "breakfast", "description": "Poha + White Matar Curry + Onion cut + Tomato cut"},
    {"cycle_type": "weeks_2_4", "day_of_week": "thursday", "meal_type": "lunch", "description": "Mixed Veg + Gongura Dal + Rasam"},
    {"cycle_type": "weeks_2_4", "day_of_week": "thursday", "meal_type": "dinner", "description": "French Bean - Carrot Dry + Lasun Chutney + Sewai"},
    
    {"cycle_type": "weeks_2_4", "day_of_week": "friday", "meal_type": "breakfast", "description": "Masala Idli + coconut chutney + Aaloo Sandwich + Green Chutney"},
    {"cycle_type": "weeks_2_4", "day_of_week": "friday", "meal_type": "lunch", "description": "Chaulai Saag"},
    {"cycle_type": "weeks_2_4", "day_of_week": "friday", "meal_type": "dinner", "description": "Kadai Paneer + Jalebi"},
    
    {"cycle_type": "weeks_2_4", "day_of_week": "saturday", "meal_type": "breakfast", "description": "Moong Dal Chilla + Mint Chutney + Black Chana Curry"},
    {"cycle_type": "weeks_2_4", "day_of_week": "saturday", "meal_type": "lunch", "description": "Chole + Veg Pulao + Bhature"},
    {"cycle_type": "weeks_2_4", "day_of_week": "saturday", "meal_type": "dinner", "description": "Gobi Capsicum Dry + Kheer"},
    
    {"cycle_type": "weeks_2_4", "day_of_week": "sunday", "meal_type": "breakfast", "description": "Millet Dosa + Peanut Chutney + Sambhar"},
    {"cycle_type": "weeks_2_4", "day_of_week": "sunday", "meal_type": "lunch", "description": "Mixed Veg + Sambhar"},
    {"cycle_type": "weeks_2_4", "day_of_week": "sunday", "meal_type": "dinner", "description": "Paneer Dum Biryani + 1 additional scoop + Onion raita (150ml) + Gravy + Ice Cream"}
]

SCHEDULE_DATA = [
    # Monday
    {"day_of_week": "monday", "item_type": "class", "name": "EEL301", "room": "ED1 L212", "start_time": time(10, 30), "end_time": time(11, 30)},
    {"day_of_week": "monday", "item_type": "class", "name": "EEL302", "room": "L105", "start_time": time(11, 30), "end_time": time(12, 30)},
    {"day_of_week": "monday", "item_type": "class", "name": "LAL221", "room": "L209", "start_time": time(12, 30), "end_time": time(13, 30)},
    {"day_of_week": "monday", "item_type": "class", "name": "EEL303", "room": "L105", "start_time": time(14, 30), "end_time": time(15, 30)},
    {"day_of_week": "monday", "item_type": "lab", "name": "CSL304", "room": "LAB", "start_time": time(15, 30), "end_time": time(17, 30)},
    {"day_of_week": "monday", "item_type": "class", "name": "CSL304", "room": "LH300", "start_time": time(17, 30), "end_time": time(18, 30)},
    
    # Tuesday
    {"day_of_week": "tuesday", "item_type": "class", "name": "EEL301", "room": "ED1 L212", "start_time": time(10, 30), "end_time": time(11, 30)},
    {"day_of_week": "tuesday", "item_type": "class", "name": "EEL302 (TUT)", "room": "L202", "start_time": time(11, 30), "end_time": time(12, 30)},
    
    # Wednesday
    {"day_of_week": "wednesday", "item_type": "class", "name": "EEL302", "room": "ED1 303", "start_time": time(9, 30), "end_time": time(10, 30)},
    {"day_of_week": "wednesday", "item_type": "class", "name": "LAL221", "room": "L209", "start_time": time(12, 30), "end_time": time(13, 30)},
    {"day_of_week": "wednesday", "item_type": "class", "name": "EEL303", "room": "L105", "start_time": time(14, 30), "end_time": time(15, 30)},
    {"day_of_week": "wednesday", "item_type": "class", "name": "CSL304", "room": "LH300", "start_time": time(17, 30), "end_time": time(18, 30)},
    
    # Thursday
    {"day_of_week": "thursday", "item_type": "class", "name": "EEL302", "room": "L105", "start_time": time(11, 30), "end_time": time(12, 30)},
    {"day_of_week": "thursday", "item_type": "lab", "name": "EEP305", "room": "ED1 303", "start_time": time(14, 30), "end_time": time(16, 30)},
    
    # Friday
    {"day_of_week": "friday", "item_type": "class", "name": "EEL303", "room": "L105", "start_time": time(9, 30), "end_time": time(10, 30)},
    {"day_of_week": "friday", "item_type": "lab", "name": "EEP304", "room": "ED1 L306", "start_time": time(14, 30), "end_time": time(17, 30)},
    {"day_of_week": "friday", "item_type": "class", "name": "CSL304", "room": "LH300", "start_time": time(17, 30), "end_time": time(18, 30)},
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