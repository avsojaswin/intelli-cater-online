import pandas as pd
import math

def clean_sql_string(s):
    if pd.isna(s):
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"

def generate_inserts():
    print("Generating seeds.sql...")
    
    with open("seeds.sql", "w", encoding='utf-8') as f:
        # 1. Ingredients
        print("Processing Ingredients...")
        try:
            inventory_df = pd.read_csv("food inventory.csv", on_bad_lines='skip')
        except TypeError:
            inventory_df = pd.read_csv("food inventory.csv", error_bad_lines=False)
            
        values_list = []
        seen_ids = set()
        
        for _, row in inventory_df.iterrows():
            item_id = row['Item ID']
            if pd.isna(item_id) or item_id in seen_ids:
                continue
            seen_ids.add(item_id)

            val = f"({item_id}, {clean_sql_string(row['Item Name'])}, {clean_sql_string(row['Category'])}, {clean_sql_string(row.get('Regional Name'))}, {clean_sql_string(row.get('Brand'))}, {clean_sql_string(row.get('Package Size'))}, {clean_sql_string(row['Unit'])}, {row['Stock Quantity'] if pd.notna(row['Stock Quantity']) else 0.0})"
            values_list.append(val)
        
        if values_list:
            f.write(f"INSERT INTO ingredients (id, name, category, regional_name, brand, package_size, unit, stock_qty) VALUES\n")
            f.write(",\n".join(values_list))
            f.write("\nON CONFLICT (id) DO NOTHING;\n\n")

        # 2. Menu Items
        print("Processing Menu Items...")
        recipes_df = pd.read_csv("Master_Recipes_Generated.csv")
        menu_items_group = recipes_df.groupby('Menu Item ID').first()
        
        values_list = []
        for menu_id, row in menu_items_group.iterrows():
            if pd.isna(menu_id): continue
            diet = "Non-Veg" if "Non-Veg" in str(row['Menu Category']) else "Veg"
            val = f"({int(menu_id)}, {clean_sql_string(row['Menu Item Name'])}, {clean_sql_string(row['Menu Category'])}, {clean_sql_string(row['Menu Sub-Category'])}, '{diet}')"
            values_list.append(val)

        if values_list:
            f.write(f"INSERT INTO menu_items (id, name, category, sub_category, diet_type) VALUES\n")
            f.write(",\n".join(values_list))
            f.write("\nON CONFLICT (id) DO NOTHING;\n\n")

        # 3. Recipes
        print("Processing Recipes...")
        values_list = []
        for _, row in recipes_df.iterrows():
            menu_id = row['Menu Item ID']
            ing_id_raw = row['Ingredient ID']
            
            if pd.notna(ing_id_raw):
                try:
                    ing_id = int(float(ing_id_raw))
                    if ing_id in seen_ids: # valid ingredient
                        val = f"({int(menu_id)}, {ing_id}, {row['Quantity']}, {clean_sql_string(row['Unit'])})"
                        values_list.append(val)
                except ValueError:
                    continue
        
        if values_list:
            # Split into chunks of 1000 to avoid limits
            chunk_size = 1000
            for i in range(0, len(values_list), chunk_size):
                chunk = values_list[i:i + chunk_size]
                f.write(f"INSERT INTO recipes (menu_item_id, ingredient_id, quantity, unit) VALUES\n")
                f.write(",\n".join(chunk))
                f.write("\nON CONFLICT DO NOTHING;\n")

    print("seeds.sql generated.")

if __name__ == "__main__":
    generate_inserts()
