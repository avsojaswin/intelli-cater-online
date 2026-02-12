from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base

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
    diet_type = Column(String)  # Veg/Non-Veg

    recipes = relationship("Recipe", back_populates="menu_item")
    production_plans = relationship("ProductionPlan", back_populates="menu_item")


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"))
    quantity = Column(Float) # Quantity needed per 1 portion of Menu Item
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
    profile_type = Column(String) # Urban/Rural

    production_plans = relationship("ProductionPlan", back_populates="event")


class ProductionPlan(Base):
    __tablename__ = "production_plan"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
    total_qty_needed = Column(Float)
    batch_1_qty = Column(Float) # 60%
    batch_2_qty = Column(Float) # 30%
    batch_3_qty = Column(Float) # 10%

    event = relationship("Event", back_populates="production_plans")
    menu_item = relationship("MenuItem", back_populates="production_plans")
