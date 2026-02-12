# Findings

## Research & Best Practices

### 1. Database & Schema
- **Choice**: SQLite for local development (zero-config, file-based), scalable to PostgreSQL for production.
- **ORM**: Use SQLAlchemy for ORM and Alembic for migrations to ensure schema version control.
- **Normalization**: Separated `ingredients` and `menu_items` with a junction table `recipes`. This avoids duplication and allows "Menu Density" calculations.

### 2. Backend Architecture (FastAPI)
- **Layered Design**:
    - `routers/`: API endpoints.
    - `services/`: Business logic (e.g., Stomach Ceiling calculation, JIT batching).
    - `models/`: Database models (SQLAlchemy).
    - `schemas/`: Pydantic models for request/response validation.
- **Validation**: Strict typing with Pydantic ensures data integrity, especially for the complex "Stomach Ceiling" math.

### 3. Frontend-Backend Integration
- **API Client**: configured in React (e.g., `axios` instance) with base URL pointing to FastAPI (default `http://localhost:8000`).
- **CORS**: FastAPI must be configured to allow requests from the React dev server (usually `http://localhost:5173` or `3000`).
- **State Management**: React Query (TanStack Query) is best practice for server state (fetching menus, inventory, events) to handle caching and loading states effectively.

### 4. Data Logic (from PDF)
- **Stomach Ceiling**: Crucial invariant (`Sum(BOM) <= Capacity`). Must be enforced in the `Service` layer when creating an Event Indent.
- **Dynamic Load Balancing**: Veg/Non-Veg split logic needs to be a core function, not just a UI toggle.

## Discoveries from Data
- **Existing Data**: `Master_Menu_Fixed.csv` (1300+ items) and `Master_Recipes_Generated.csv` (4600+ lines).
- **Inventory**: `food inventory.csv` (232 items) provides the base for `ingredients` table.
- **Gaps**: `Master_Menu` lacks explicit IDs in the CSV, but `Master_Recipes` has them. We will use `Master_Recipes` as the primary source for Menu Items validation.

## Constraints
- **Protocol 0**: Specific mandatory initialization steps.
- **Zero-Waste Goal**: The system is not just a tracker; it's an optimization engine. Logic must prioritize "Waste Avoidance".
