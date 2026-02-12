# Layer 3: Deterministic Tools
> "Push complexity into deterministic code."

This directory contains utility scripts for data processing, maintenance, and verification.

## Available Tools

### 1. PDF Extractor (`read_pdf.py`)
- **Usage**: `python tools/read_pdf.py <path_to_pdf>`
- **Purpose**: Extracts text content from PDF files (e.g., Logic Inputs).
- **Dependencies**: `pypdf`

### 2. Data Ingestion (`../backend/scripts/ingest_data.py`)
- **Usage**: `python backend/scripts/ingest_data.py`
- **Purpose**: Populates `catering.db` from `Master_Recipes_Generated.csv` and `food inventory.csv`.
- **Logic**: Upserts Ingredients and Menu Items. Links Recipes.

### 3. Database Reset (`reset_db.py`)
- **Usage**: `python tools/reset_db.py`
- **Purpose**: Drops all tables and re-creates the schema. **WARNING: DESTRUCTIVE**.
