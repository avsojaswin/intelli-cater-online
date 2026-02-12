# System Architecture (Layer 1)

## 1. Core Logic Invariants
> These rules must NOT be violated by any code changes.

### 1.1 The Stomach Ceiling
- **Definition**: The total weight of food prepared must NOT exceed the aggregated metabolic capacity of the guests.
- **Formula**: `Capacity = (Male * 1.0) + (Female * 0.85) + (Child * 0.5)` (in kg/units).
- **Enforcement**: Middleware/Service layer (`backend/services/calculation.py`).

### 1.2 Zero-Waste Protocol
- **JIT Batching**: Food production is split into batches:
    - **T-0**: 60% (Base load)
    - **T+1h**: 30% (Variable load)
    - **T+2h**: 10% (Buffer, optional)
- **Menu Density**: Portion sizes are typically dynamic. If Menu Variety (N) increases, Portion Size (P) must decrease to maintain `N * P <= Capacity`.

## 2. Technical Stack SOPs

### 2.1 Backend (FastAPI)
- **State**: Statutory stateless. All state persists in SQLite (`catering.db`).
- **Data Source**: `Master_Recipes_Generated.csv` is the Source of Truth for Menu Items until fully migrated to DB.
- **Validation**: Pydantic models are mandatory for all IO.

### 2.2 Frontend (React)
- **State**: TanStack Query (React Query) for server state. Local React State for UI controls.
- **Routing**: `react-router-dom` handles navigation.
- **Components**: Shadcn/UI-like architecture. Atomic design.

### 2.3 Database
- **Schema**:
    - `ingredients`: Raw materials.
    - `menu_items`: Sellable units.
    - `recipes`: The BOM linking Items to Ingredients.
- **Migrations**: Alembic must be used for schema changes (Task for Phase 5).

## 3. Workflow & Protocols
- **Data-First**: Always define the Schema in `gemini.md` before writing code.
- **Test-Driven**: Verify logic with `curl` or script before UI integration.
