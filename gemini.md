# Gemini Protocol - Project Constitution

## 1. Data Schemas
> **Rule**: Coding only begins once the "Payload" shape is confirmed.

### Input Schema (Data Sources)
- **Master_Menu_Fixed.csv**: `[Category, Sub-Category, Item Name, Diet Type]`
- **Master_Recipes_Generated.csv**: `[Menu Item ID, Menu Category, Menu Sub-Category, Menu Item Name, Ingredient Type, Ingredient ID, Ingredient Name, Quantity, Unit]`
- **food inventory.csv**: `[Category, Item ID, Item Name, Regional Name, Brand, Package Size, Unit, Stock Quantity]`
- **Event Input (User)**: `[Date, Headcount (Male/Female/Child), Profile (Urban/Rural), Venue]`

### Output Schema (Payload)
- **SQL Database Schema**:
    - **`ingredients`**: `id` (PK), `name`, `category`, `regional_name`, `brand`, `stock_qty`, `unit`, `package_size`
    - **`menu_items`**: `id` (PK), `name`, `category`, `sub_category`, `diet_type` (Veg/Non-Veg)
    - **`recipes`**: `id` (PK), `menu_item_id` (FK), `ingredient_id` (FK), `quantity`, `unit`
    - **`events`**: `id` (PK), `name`, `date`, `pax_male`, `pax_female`, `pax_child`, `profile_type` (Urban/Rural)
    - **`production_plan`**: `id` (PK), `event_id` (FK), `menu_item_id` (FK), `total_qty_needed`, `batch_1_qty`, `batch_2_qty`

### Behavioral Rules
- **Stomach Ceiling**: Total consumption/head is fixed (Male: 1.0, Female: 0.85, Child: 0.5).
- **JIT Batching**: 60% - 30% - 10% production split.
- **Waste Tracking**: Monitor and adjust coefficients if waste > 5%.

## 3. Architectural Invariants
- **Layer 1: Architecture (`architecture/`)**: Technical SOPs. If logic changes, update SOP first.
- **Layer 2: Navigation**: Reasoning layer. Routing data between SOPs and Tools.
- **Layer 3: Tools (`tools/`)**: Deterministic Python scripts. Atomic and testable.
- **Data-First Rule**: Define schemas before building tools.
- **Self-Annealing**: Analyze -> Patch -> Test -> Update Architecture.
- **Deliverables**:
    - Local (`.tmp/`): Ephemeral.
    - Global (Cloud): Final payload.

## Maintenance Log
