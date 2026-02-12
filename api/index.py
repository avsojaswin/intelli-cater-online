from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import os

# --- Database Setup ---
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./catering.db")

connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Models ---
class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    regional_name = Column(String, nullable=True)
    brand = Column(String, nullable=True)
    package_size = Column(String, nullable=True)
    unit = Column(String)
    stock_qty = Column(Float, default=0.0)
    recipes = relationship("Recipe", back_populates="ingredient")

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    sub_category = Column(String)
    diet_type = Column(String)
    recipes = relationship("Recipe", back_populates="menu_item")
    production_plans = relationship("ProductionPlan", back_populates="menu_item")

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"))
    quantity = Column(Float)
    unit = Column(String)
    menu_item = relationship("MenuItem", back_populates="recipes")
    ingredient = relationship("Ingredient", back_populates="recipes")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    date = Column(DateTime)
    venue = Column(String)
    pax_male = Column(Integer, default=0)
    pax_female = Column(Integer, default=0)
    pax_child = Column(Integer, default=0)
    profile_type = Column(String)
    production_plans = relationship("ProductionPlan", back_populates="event")

class ProductionPlan(Base):
    __tablename__ = "production_plan"
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
    total_qty_needed = Column(Float)
    batch_1_qty = Column(Float)
    batch_2_qty = Column(Float)
    batch_3_qty = Column(Float)
    event = relationship("Event", back_populates="production_plans")
    menu_item = relationship("MenuItem", back_populates="production_plans")

# --- Calculation Logic ---
def calculate_indent(db: Session, event_id: int, menu_item_ids: list):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise ValueError(f"Event {event_id} not found")

    total_capacity = event.pax_male + event.pax_female + (event.pax_child * 0.5)
    num_items = len(menu_item_ids)
    if num_items == 0:
        return {"capacity": total_capacity, "total_items": 0, "portion_per_item": 0, "indent": []}
    portion_per_item = total_capacity / num_items

    ingredient_totals = {}
    for item_id in menu_item_ids:
        recipes = db.query(Recipe).filter(Recipe.menu_item_id == item_id).all()
        servings_to_prep = portion_per_item
        for recipe in recipes:
            if recipe.ingredient_id:
                qty = recipe.quantity * servings_to_prep
                ing_id = recipe.ingredient_id
                if ing_id not in ingredient_totals:
                    ing_obj = db.query(Ingredient).filter(Ingredient.id == ing_id).first()
                    name = ing_obj.name if ing_obj else "Unknown"
                    ingredient_totals[ing_id] = {
                        "id": ing_id, "name": name, "quantity": 0.0,
                        "unit": recipe.unit,
                        "category": ing_obj.category if ing_obj else "Misc"
                    }
                ingredient_totals[ing_id]["quantity"] += qty

    return {
        "capacity": total_capacity, "total_items": num_items,
        "portion_per_item": portion_per_item,
        "indent": list(ingredient_totals.values())
    }

def jit_batching(total_qty):
    return {"batch_1": round(total_qty * 0.6, 2), "batch_2": round(total_qty * 0.3, 2), "batch_3": round(total_qty * 0.1, 2)}

# --- Pydantic Schemas ---
class IngredientSchema(BaseModel):
    id: int; name: str; unit: str; stock_qty: float
    class Config: orm_mode = True

class MenuItemSchema(BaseModel):
    id: int; name: str; category: str; sub_category: str; diet_type: str
    class Config: orm_mode = True

class EventCreate(BaseModel):
    name: str; date: datetime; venue: str
    pax_male: int; pax_female: int; pax_child: int
    profile_type: str; menu_item_ids: Optional[List[int]] = []

class EventSchema(BaseModel):
    id: int; name: str; date: datetime; venue: str
    pax_male: int; pax_female: int; pax_child: int; profile_type: str
    class Config: orm_mode = True

class IndentRequest(BaseModel):
    event_id: int; menu_item_ids: List[int]

# --- FastAPI App ---
app = FastAPI(title="Intelli-Cater Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "database": "connected"}

@app.post("/api/events", response_model=EventSchema)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    event_data = event.dict(exclude={"menu_item_ids"})
    db_event = Event(**event_data)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    if event.menu_item_ids:
        for item_id in event.menu_item_ids:
            plan = ProductionPlan(
                event_id=db_event.id, menu_item_id=item_id,
                total_qty_needed=0.0, batch_1_qty=0.0, batch_2_qty=0.0, batch_3_qty=0.0
            )
            db.add(plan)
        db.commit()
    return db_event

@app.get("/api/menu-items", response_model=List[MenuItemSchema])
def read_menu_items(skip: int = 0, limit: int = 10000, db: Session = Depends(get_db)):
    return db.query(MenuItem).offset(skip).limit(limit).all()

@app.get("/api/events", response_model=List[EventSchema])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Event).offset(skip).limit(limit).all()

@app.post("/api/calculate-indent")
def get_indent(request: IndentRequest, db: Session = Depends(get_db)):
    try:
        return calculate_indent(db, request.event_id, request.menu_item_ids)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Vercel handler - 'app' is the ASGI application
handler = app
