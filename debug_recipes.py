from backend.database import SessionLocal
from backend.models import Recipe, MenuItem, Ingredient
import pandas as pd

def debug_recipes():
    db = SessionLocal()
    try:
        print("Checking DB State...")
        m_count = db.query(MenuItem).count()
        i_count = db.query(Ingredient).count()
        r_count = db.query(Recipe).count()
        print(f"Menu Items: {m_count}, Ingredients: {i_count}, Recipes: {r_count}")

        # Check specific items
        m1 = db.query(MenuItem).filter(MenuItem.id == 1).first()
        i101 = db.query(Ingredient).filter(Ingredient.id == 101).first()
        print(f"MenuItem 1 exists: {m1 is not None}")
        print(f"Ingredient 101 exists: {i101 is not None}")

        if m1 and i101:
            print("Attempting manual insertion...")
            existing = db.query(Recipe).filter_by(menu_item_id=1, ingredient_id=101).first()
            if not existing:
                r = Recipe(menu_item_id=1, ingredient_id=101, quantity=0.005, unit='KG')
                db.add(r)
                db.commit()
                print("Manual insertion successful.")
            else:
                print("Recipe already exists (manual check).")
        
        # Check CSV reading
        print("Reading CSV...")
        df = pd.read_csv("Master_Recipes_Generated.csv")
        print(f"CSV Rows: {len(df)}")
        row = df.iloc[0]
        print(f"Row 0: MenuID={row['Menu Item ID']} ({type(row['Menu Item ID'])}), IngID={row['Ingredient ID']} ({type(row['Ingredient ID'])})")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_recipes()
