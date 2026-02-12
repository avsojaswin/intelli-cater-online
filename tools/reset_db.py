import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.database import engine, Base
from backend.models import Ingredient, MenuItem, Recipe, Event, ProductionPlan

def reset_database():
    print("WARNING: This will drop all tables in catering.db.")
    confirm = input("Are you sure? (y/n): ")
    if confirm.lower() == 'y':
        print("Dropping tables...")
        Base.metadata.drop_all(bind=engine)
        print("Creating tables...")
        Base.metadata.create_all(bind=engine)
        print("Database reset complete.")
    else:
        print("Operation cancelled.")

if __name__ == "__main__":
    reset_database()
