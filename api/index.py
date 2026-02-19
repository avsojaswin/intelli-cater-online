from backend.main import app
from mangum import Mangum

# Mangum wraps the FastAPI ASGI app for Vercel serverless.
# backend.main sets root_path="/api" when VERCEL env is present.
handler = Mangum(app, lifespan="off")
