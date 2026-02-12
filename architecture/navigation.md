# User Navigation Flows (Layer 2)

## 1. Event Planning Flow
**Goal**: Create an event and generate a resource indent.

1.  **Landing Page** (`/`)
    - marketing content.
    - CTA: "Login" or "Get Started".
2.  **Login** (`/login`)
    - *Mock Auth for now*.
    - Redirects to `/app/events`.
3.  **Events Dashboard** (`/app/events`)
    - **Demographics Input**: Slider/Input for Male/Female/Child.
        - *System Action*: Updates "Total Metabolic Load" in real-time.
    - **Context Calibration**: Toggle Urban/Rural, Spice Level.
    - **Menu Selection**: Search & Select items.
        - *System Action*: Calculates "Stomach Ceiling" saturation.
        - *Visual*: Bar chart fills up (Green -> Amber -> Red).
    - **Action**: Click "Generate BOM".
        - *System Action*: POST `/calculate-indent`.
        - *Visual*: Show Indent Modal/Card.

## 2. JIT Production Flow
**Goal**: View production batches during the event.

1.  **JIT Dashboard** (`/app/jit`)
    - Select Active Event.
    - **Timeline View**:
        - **T-4h**: Pre-prep instructions.
        - **T-0**: Batch 1 Cooking Instructions (60%).
        - **T+1h**: Batch 2 Trigger (30%).
    - **Feedback Loop**: "Waste Reporting" button to adjust coefficients for next batch.

## 3. Inventory Management (Future)
- `/app/inventory`: CRUD for Ingredients.
