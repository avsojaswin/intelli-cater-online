from backend.models import Event, MenuItem, Ingredient, Recipe, ProductionPlan
from sqlalchemy.orm import Session

# Constants from PDF
MALE_CONSUMPTION = 1.0
FEMALE_CONSUMPTION = 0.85
CHILD_CONSUMPTION = 0.5

def calculate_stomach_ceiling(event: Event):
    # Total Capacity = (Male * 1.0) + (Female * 0.85) + (Child * 0.5)
    capacity = (event.pax_male * MALE_CONSUMPTION) + \
               (event.pax_female * FEMALE_CONSUMPTION) + \
               (event.pax_child * CHILD_CONSUMPTION)
    return capacity

def calculate_indent(db: Session, event_id: int, menu_item_ids: list[int]):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise ValueError("Event not found")
    
    capacity = calculate_stomach_ceiling(event)

    # 1. Total Capacity needed (in KG, assuming 1 unit = 1 kg for simplicity or normalized)
    total_capacity = capacity
    num_items = len(menu_item_ids)
    if num_items == 0:
        return {"capacity": total_capacity, "indent": []}

    # 2. Distribute Capacity (Menu Density Logic)
    # Simple uniform distribution for now: Portion = Capacity / N
    portion_per_item = total_capacity / num_items
    
    # 3. Aggregation
    ingredient_totals = {} # {id: {name, qty, unit}}

    for item_id in menu_item_ids:
        recipes = db.query(Recipe).filter(Recipe.menu_item_id == item_id).all()
        
        # Assumption: Recipe Quantity is for **1 Serving**.
        # Treat "Capacity" as "Total Servings" for now.
        
        servings_to_prep = portion_per_item 
        
        for recipe in recipes:
            if recipe.ingredient_id: # Skip N/A for now
               qty = recipe.quantity * servings_to_prep
               ing_id = recipe.ingredient_id
               
               if ing_id not in ingredient_totals:
                   ing_obj = db.query(Ingredient).filter(Ingredient.id == ing_id).first()
                   name = ing_obj.name if ing_obj else "Unknown"
                   ingredient_totals[ing_id] = {
                       "id": ing_id,
                       "name": name,
                       "quantity": 0.0,
                       "unit": recipe.unit,
                       "category": ing_obj.category if ing_obj else "Misc"
                   }
               
               ingredient_totals[ing_id]["quantity"] += qty

    # Convert to list
    indent_list = list(ingredient_totals.values())
    
    return {
        "capacity": total_capacity, 
        "total_items": num_items,
        "portion_per_item": portion_per_item,
        "indent": indent_list
    }

def jit_batching(total_qty: float):
    return {
        "batch_1": total_qty * 0.60,
        "batch_2": total_qty * 0.30,
        "batch_3": total_qty * 0.10
    }
