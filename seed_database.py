import asyncio
import os
import sys
from typing import List, Dict
from datetime import time

import sqlalchemy

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from CampusCueAPI.database import database, mess_menu_items_table, schedule_items_table

MENU_DATA: List[Dict[str, str]] = [
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Poori + Potato Onion Masala + Bombay Sandwich + Banana"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Soya keema + Sambhar"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Afghani Panner + Fruit Custard"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Onion-capsicum-tomato Uttapam+ Sambhar + Peanut Chutney + Tomata Chutney + Chickpea Salad+Sweet Corn"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Kadi Onion Pakoda + Onion Aloo + Aloo Chokha + Sambhar"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Kaddu Ki Sabji + Pudina Chutney + Moong Dal Halwa"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Aloo onion Paratha + Pudina Chutney & Sauce + curd + Sprouts(germinated)"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Corn palak"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Butter Paneer + Gulab Jamun"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "thursday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Idli+Vada+Coconut Chutney+Sambhar+ Tomato Chutney + Banana"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "thursday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Veg Kofta"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "thursday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Spring Onion + Aloo + Rajma + Sewai"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Poha+ White Matar Curry + Onion cut + Tomato cut + Aaloo Sandwich + Chickpea Salad"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Cabbage +Matar"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Malai Kofta + Jalebi"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "saturday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Ragi Dosa + Peanut Chutney + Sambhar + Tomata Chutney + Banana"
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
    "description": "Bhindi Do Pyaja + Kheer"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "sunday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Suji Upma + Aaloo Sandwich + Chickpea Salad with peanut"
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
    "description": "Paneer Dum Biryani + 1 additional scoop rice+ Onion Raita + Gravy + Flavoured Ice Cream"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Poori + Potato Onion Masala + Bombay Sandwich + Boiled eggs"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Soya keema + Sambhar"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Afghani Panner + Fruit Custard"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Onion Uttapam+ Sambhar + Peanut Chutney + Tomata Chutney + sprouts( germinated )"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Kadi Onion Pakoda + Onion Aloo + Aloo Chokha + Sambhar"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Kaddu Ki Sabji + Pudina Chutney + Moong Dal Halwa"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Aloo onion Paratha + Pudina Chutney & Sauce + curd + Boiled eggs"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Corn palak"
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
    "description": "Idli+Vada+Coconut Chutney+Sambhar+ Tomato Chutney + Egg Bhurji"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "thursday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Veg Kofta"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "thursday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Spring Onion + Aloo + Rajma + sewai"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Poha+ White Matar Curry + Onion cut + Tomato cut + Aaloo Sandwich + Chickpea Salad"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Cabbage +Matar"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Egg Curry + Jalebi"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "saturday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Ragi Dosa + Peanut Chutney + Sambhar + Tomata Chutney + Boiled eggs"
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
    "description": "Bhindi ki sabji + Kheer"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "sunday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Suji Upma + Aaloo Sandwich + Omelete"
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
    "description": "Chicken Dum Biryani + 1 additional scoop + Onion raita + Gravy + Flavoured Ice Cream"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Poori + Potato Onion Masala + Bombay Sandwich + Banana"
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
    "description": "Afghani Panner + Fruit Custard"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Mysore Bajji + Coconut Chutney sambhar + Tomato Chutney + Sprouts(germinated)"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Besan Patodi"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Bhindi Bhurji + pudina chutney + Moong Dal Halwa"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Aloo Paratha + Green Chutney + Curd + Chickpea Salad"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Aloo Matha + Sambhar"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Mattar Panner + Gulab Jamun"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "thursday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Moong Dal Chilla + Mint Chutney + Black Chana Curry + Aloo Sandwich + Banana"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "thursday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Veg Kofta"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "thursday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Karela Dry + Rajma + manchow soup + Sabu Dana Kheer"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "friday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Masala idli+Coconut/Peanut Chutney+Tomato Chutney + Aloo Sandwich + Chickpea Salad"
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
    "description": "Soya Chaap + Lasun Chutney + Jalebi"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "saturday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Poha+ White Matar Curry + Onion cut + Tomato cut + Banana"
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
    "description": "soyabean curry + Kheer"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "sunday",
    "meal_type": "breakfast",
    "menu_type": "veg",
    "description": "Millet dosa + Coconut Chutney+ Tomato Chutney Sambhar + Banana"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "sunday",
    "meal_type": "lunch",
    "menu_type": "veg",
    "description": "Mixed Veg + kurthi Dal + pudina chutney"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "sunday",
    "meal_type": "dinner",
    "menu_type": "veg",
    "description": "Paneer Dum Biryani + 1 additional scoop + Onion raita + Gravy + Flavoued Ice cream"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Poori + Potato Onion Masala + Bombay Sandwich + Omelette"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Lauki Chana Dal + Dal Makhni"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Afghani Panner + Fruit Custard"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Mysore Bajji + Coconut Chutney sambhar + Tomato Chutney + Sprouts(germinated)"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Bhindi Bhurji"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Besan Patodi + pudina chutney + Moong Dal Halwa"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Aloo Paratha + Green Chutney + Curd + Sprouts (germinated)"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Aloo Matha + Sambhar"
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
    "description": "Moong Dal Chilla + Mint Chutney + Black Chana Curry + Aloo Sandwich + Boiled eggs"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "thursday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Veg Kofta"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "thursday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Karela Dry + Rajma + Manchow soup + Sabu Dana Kheer"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "friday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Masala idli+Coconut/Peanut Chutney+Tomato Chutney + Aloo Sandwich + Sprouts (germinated)"
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
    "description": "Poha+ White Matar Curry + Onion cut + Tomato cut + Egg Bhurji"
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
    "description": "soyabean curry + Kheer"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "sunday",
    "meal_type": "breakfast",
    "menu_type": "non_veg",
    "description": "Millet dosa + Coconut Chutney+ Tomato Chutney Sambhar + Boiled eggs"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "sunday",
    "meal_type": "lunch",
    "menu_type": "non_veg",
    "description": "Mixed Veg + kurthi Dal + pudina chutney"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "sunday",
    "meal_type": "dinner",
    "menu_type": "non_veg",
    "description": "Chicken Biryani + 1 additional scoop +Onion raita + Gravy + Flavoured Ice Cream"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Poori + Potato Onion Masala + Bombay Sandwich + Boiled eggs"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Soya keema + Sambhar"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "monday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Afghani Panner + Fruit Custard"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Onion-capsicum-tomato Uttapam+ Sambhar + Peanut Chutney + Tomata Chutney + Chickpea Salad+Sweet Corn"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Kadi Onion Pakoda + Onion Aloo + Aloo Chokha + Sambhar"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "tuesday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Kaddu Ki Sabji + Pudina Chutney + Moong Dal Halwa"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Aloo onion Paratha + Pudina Chutney & Sauce + curd + Boiled eggs"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Corn palak"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "wednesday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Butter Paneer + Gulab Jamun"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "thursday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Idli+Vada+Coconut Chutney+Sambhar+ Tomato Chutney + Egg Bhurji"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "thursday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Veg Kofta"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "thursday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Spring Onion + Aloo + Rajma + Sewai"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Poha+ White Matar Curry + Onion cut + Tomato cut + Aaloo Sandwich + Chickpea Salad"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Cabbage +Matar"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "friday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Egg Curry + Jalebi"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "saturday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Ragi Dosa + Peanut Chutney + Sambhar + Tomata Chutney + Boiled eggs"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "saturday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Chole + Veg Pulao + Bhature"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "saturday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Bhindi Do Pyaja + Kheer"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "sunday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Suji Upma + Aaloo Sandwich + Omelete"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "sunday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Mixed veg + Sambhar"
  },
  {
    "cycle_type": "weeks_1_3",
    "day_of_week": "sunday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Paneer Dum Biryani + 1 additional scoop rice+ Onion Raita + Gravy + Flavoured Ice Cream"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Poori + Potato Onion Masala + Bombay Sandwich + Omelette"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Lauki Chana Dal + Dal Makhni"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "monday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Afghani Panner + Fruit Custard"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Mysore Bajji + Coconut Chutney sambhar + Tomato Chutney + Sprouts(germinated)"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Besan Patodi"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "tuesday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Bhindi Bhurji + pudina chutney + Moong Dal Halwa"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Aloo Paratha + Green Chutney + Curd + Chickpea Salad"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Aloo Matha + Sambhar"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "wednesday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Mattar Panner + Gulab Jamun"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "thursday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Moong Dal Chilla + Mint Chutney + Black Chana Curry + Aloo Sandwich + Boiled eggs"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "thursday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Veg Kofta"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "thursday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Karela Dry + Rajma + manchow soup + Sabu Dana Kheer"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "friday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Masala idli+Coconut/Peanut Chutney+Tomato Chutney + Aloo Sandwich + Chickpea Salad"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "friday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Aloo bhujia + Sambhar"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "friday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Soya Chaap + Lasun Chutney + Jalebi"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "saturday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Poha+ White Matar Curry + Onion cut + Tomato cut + Egg Bhurji"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "saturday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Chole + Veg Pulao + Bhature"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "saturday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "soyabean curry + Kheer"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "sunday",
    "meal_type": "breakfast",
    "menu_type": "egg",
    "description": "Millet dosa + Coconut Chutney+ Tomato Chutney Sambhar + Boiled eggs"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "sunday",
    "meal_type": "lunch",
    "menu_type": "egg",
    "description": "Mixed Veg + kurthi Dal + pudina chutney"
  },
  {
    "cycle_type": "weeks_2_4",
    "day_of_week": "sunday",
    "meal_type": "dinner",
    "menu_type": "egg",
    "description": "Paneer Dum Biryani + 1 additional scoop + Onion raita + Gravy + Flavoued Ice cream"
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
    {"day_of_week": "friday", "item_type": "class", "course_type": "elective", "name": "Power Quality", "room": "L105", "start_time": time(10, 30), "end_time": time(11, 30)},
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
    print("Performing schedule sync...")
    
    for item_data in SCHEDULE_DATA:
        find_query = schedule_items_table.select().where(
            sqlalchemy.and_(
                schedule_items_table.c.name == item_data["name"],
                schedule_items_table.c.day_of_week == item_data["day_of_week"],
                schedule_items_table.c.start_time == item_data["start_time"]
            )
        )
        
        existing_item = await database.fetch_one(find_query)
        
        if existing_item:
            print(f"Updating existing course: {item_data['name']}")
            update_query = (
                schedule_items_table.update()
                .where(schedule_items_table.c.id == existing_item["id"])
                .values(**item_data)
            )
            await database.execute(update_query)
        else:
            print(f"Adding new course: {item_data['name']}")
            insert_query = schedule_items_table.insert().values(**item_data)
            await database.execute(insert_query)
            
    print("Schedule sync complete.")

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
