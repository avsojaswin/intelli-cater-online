# Intelli-Cater
**Industrial Catering Resource Orchestration Engine.**
> Transforming event food production with data-driven JIT batching and metabolic profiling.

## Architecture
This project follows a 3-Layer Architecture:
1.  **Directives (Layer 1)**: Core Logic Invariants ("Stomach Ceiling", "Zero-Waste") defined in `architecture/system_design.md`.
2.  **Navigation (Layer 2)**: User Flows (Event Planning -> JIT Dashboard) defined in `architecture/navigation.md`.
3.  **Tools (Layer 3)**: Deterministic scripts in `tools/` and `backend/services/`.

## Tech Stack
-   **Backend**: FastAPI (Python 3.9+) + SQLite
-   **Frontend**: React (Vite) + TailwindCSS + Shadcn/UI
-   **Deployment**: Vercel (Serverless Functions + Static Site)

## live Demo
[https://intelli-cater-kjv7k1rfg-ojaswins-projects.vercel.app](https://intelli-cater-kjv7k1rfg-ojaswins-projects.vercel.app)

## Local Development

### Prerequisites
-   Python 3.9+
-   Node.js 18+

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Run Server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd intelli-cater
npm install
npm run dev
# App runs at http://localhost:5173
```

## Key Features
-   **Stomach Ceiling Algorithm**: Calculates precise food quantities based on guest metabolic load.
-   **JIT Batching**: 60-30-10 production split to minimize waste.
-   **Dynamic Indent**: Generates a detailed Bill of Materials (BOM) from menu selection.

## Project Structure
-   `/backend`: API and Database Logic.
-   `/intelli-cater`: React Frontend.
-   `/architecture`: System Design Docs.
-   `/tools`: Utility scripts (PDF extraction, DB reset).
