-- Migration Script for Intelli-Cater

CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY,
    name TEXT,
    category TEXT,
    regional_name TEXT,
    brand TEXT,
    package_size TEXT,
    unit TEXT,
    stock_qty FLOAT DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY,
    name TEXT,
    category TEXT,
    sub_category TEXT,
    diet_type TEXT
);

CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    menu_item_id INTEGER REFERENCES menu_items(id),
    ingredient_id INTEGER REFERENCES ingredients(id),
    quantity FLOAT,
    unit TEXT
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name TEXT,
    date TIMESTAMP,
    venue TEXT,
    pax_male INTEGER DEFAULT 0,
    pax_female INTEGER DEFAULT 0,
    pax_child INTEGER DEFAULT 0,
    profile_type TEXT
);

CREATE TABLE IF NOT EXISTS production_plan (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    menu_item_id INTEGER REFERENCES menu_items(id),
    total_qty_needed FLOAT,
    batch_1_qty FLOAT,
    batch_2_qty FLOAT,
    batch_3_qty FLOAT
);
