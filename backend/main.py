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
    "https://intelli-cater.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    menu_item_ids: Optional[List[int]] = []

class EventSchema(BaseModel):
    id: int
    name: str
    date: datetime
    venue: str
    pax_male: int
    pax_female: int
    pax_child: int
    profile_type: str
    class Config:
        orm_mode = True

@app.post("/events", response_model=EventSchema)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    # 1. Create Event
    event_data = event.dict(exclude={"menu_item_ids"})
    db_event = Event(**event_data)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    # 2. Save Menu Selection (Production Plans)
    if event.menu_item_ids:
        for item_id in event.menu_item_ids:
            # Check if plan already exists (if updating) - for now just create new
            plan = ProductionPlan(
                event_id=db_event.id,
                menu_item_id=item_id,
                total_qty_needed=0.0, # Will be calculated later
                batch_1_qty=0.0,
                batch_2_qty=0.0,
                batch_3_qty=0.0
            )
            db.add(plan)
        db.commit()
        
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
