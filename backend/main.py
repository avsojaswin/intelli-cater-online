from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from backend.database import get_db, Base, engine
from backend.models import Ingredient, MenuItem, Event, ProductionPlan
from backend.services.calculation import calculate_indent, jit_batching

# Create tables if not exist (redundant if ingest ran, but safe)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Intelli-Cater Backend")

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class IngredientSchema(BaseModel):
    id: int
    name: str
    unit: str
    stock_qty: float
    class Config:
        orm_mode = True

class MenuItemSchema(BaseModel):
    id: int
    name: str
    category: str
    sub_category: str
    diet_type: str
    class Config:
        orm_mode = True

class EventCreate(BaseModel):
    name: str
    date: datetime
    venue: str
    pax_male: int
    pax_female: int
    pax_child: int
    profile_type: str # Urban/Rural

class EventSchema(EventCreate):
    id: int
    class Config:
        orm_mode = True

class IndentRequest(BaseModel):
    event_id: int
    menu_item_ids: List[int]

# Endpoints

@app.get("/")
def read_root():
    return {"message": "Intelli-Cater Backend is Running"}

@app.get("/ingredients", response_model=List[IngredientSchema])
def read_ingredients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ingredients = db.query(Ingredient).offset(skip).limit(limit).all()
    return ingredients

@app.get("/menu-items", response_model=List[MenuItemSchema])
def read_menu_items(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    # Higher limit for menu items as there are 1300+
    items = db.query(MenuItem).offset(skip).limit(limit).all()
    return items

@app.post("/events", response_model=EventSchema)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@app.get("/events", response_model=List[EventSchema])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = db.query(Event).offset(skip).limit(limit).all()
    return events

@app.post("/calculate-indent")
def get_indent(request: IndentRequest, db: Session = Depends(get_db)):
    try:
        # 1. Calculate Indent (Stomach Ceiling)
        indent_data = calculate_indent(db, request.event_id, request.menu_item_ids)
        
        # 2. Logic not fully implemented in service yet returning capacity for now
        return indent_data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
