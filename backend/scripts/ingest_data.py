import sys
import os
import pandas as pd
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend.models import Ingredient, MenuItem, Recipe

# Create tables
Base.metadata.create_all(bind=engine)

def ingest_data():
    session = SessionLocal()
    try:
        # 1. Ingest Ingredients from Inventory
        print("Ingesting Ingredients...")
        try:
            inventory_df = pd.read_csv("food inventory.csv", on_bad_lines='skip')
        except TypeError:
             inventory_df = pd.read_csv("food inventory.csv", error_bad_lines=False)
        # specific column mapping based on file inspection
        # Category,Item ID,Item Name,Regional Name,Brand,Package Size,Unit,Stock Quantity
        
        for _, row in inventory_df.iterrows():
            item_id = row['Item ID']
            # efficient upsert check
            existing = session.query(Ingredient).filter(Ingredient.id == item_id).first()
            if not existing:
                ingredient = Ingredient(
                    id=item_id,
                    name=row['Item Name'],
                    category=row['Category'],
                    regional_name=row['Regional Name'] if pd.notna(row['Regional Name']) else None,
                    brand=row['Brand'] if pd.notna(row['Brand']) else None,
                    package_size=row['Package Size'] if pd.notna(row['Package Size']) else None,
                    unit=row['Unit'],
                    stock_qty=float(row['Stock Quantity']) if pd.notna(row['Stock Quantity']) else 0.0
                )
                session.add(ingredient)
        session.commit()
        print("Ingredients ingested.")

        # 2. Ingest Menu Items & Recipes
        print("Ingesting Menu Items and Recipes...")
        recipes_df = pd.read_csv("Master_Recipes_Generated.csv")
        # Menu Item ID,Menu Category,Menu Sub-Category,Menu Item Name,Ingredient Type,Ingredient ID,Ingredient Name,Quantity,Unit
        
        # Unique Menu Items
        menu_items_group = recipes_df.groupby('Menu Item ID').first()
        
        for menu_id, row in menu_items_group.iterrows():
             # Check if exists
            existing_item = session.query(MenuItem).filter(MenuItem.id == menu_id).first()
            if not existing_item:
                menu_item = MenuItem(
                    id=menu_id,
                    name=row['Menu Item Name'],
                    category=row['Menu Category'],
                    sub_category=row['Menu Sub-Category'],
                    diet_type="Non-Veg" if "Non-Veg" in row['Menu Category'] else "Veg" # Simple heuristic, can be refined
                )
                session.add(menu_item)
        session.commit()
        print("Menu Items ingested.")

        # Recipes
        # We need to link recipes to ingredients. 
        # Note: Master_Recipes_Generated.csv has 'Ingredient ID'. 
        # Sometimes it is 'N/A' for Fresh items (Chicken, etc) which might not be in inventory csv?
        # Let's handle 'N/A' or missing IDs gracefully or create dummy ingredients.
        
        print("Ingesting Recipes linkage...")
        for _, row in recipes_df.iterrows():
            menu_id = row['Menu Item ID']
            ing_id_raw = row['Ingredient ID']
            
            # If Ingredient ID is valid and exists in our Ingredients table
            if pd.notna(ing_id_raw) and str(ing_id_raw).isdigit():
                ing_id = int(ing_id_raw)
                # Check if this recipe link already exists (avoid duplicates if re-run)
                exists = session.query(Recipe).filter_by(menu_item_id=menu_id, ingredient_id=ing_id).first()
                if not exists:
                    # check if ingredient actually exists in DB, if not, maybe skip or log
                    if session.query(Ingredient).filter(Ingredient.id == ing_id).first():
                        recipe = Recipe(
                            menu_item_id=menu_id,
                            ingredient_id=ing_id,
                            quantity=float(row['Quantity']),
                            unit=row['Unit']
                        )
                        session.add(recipe)
            else:
                # Handle Fresh items or N/A IDs - For now, we skip or could insert into Ingredients as 'Fresh' type
                pass

        session.commit()
        print("Recipes ingested.")

    except Exception as e:
        print(f"Error: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    ingest_data()
