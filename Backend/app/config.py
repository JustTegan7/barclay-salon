from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseModel):
    app_env: str = os.getenv("APP_ENV", "dev")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./barclay.db")

    jwt_secret: str = os.getenv("JWT_SECRET", "change-me")
    jwt_alg: str = os.getenv("JWT_ALG", "HS256")
    jwt_expires_minutes: int = int(os.getenv("JWT_EXPIRES_MINUTES", "10080"))

    bootstrap_admin_email: str = os.getenv("BOOTSTRAP_ADMIN_EMAIL", "admin@barclay.local")
    bootstrap_admin_password: str = os.getenv("BOOTSTRAP_ADMIN_PASSWORD", "ChangeMeNow!123")
    bootstrap_owner_email: str = os.getenv("BOOTSTRAP_OWNER_EMAIL", "ryan@barclay.local")
    bootstrap_owner_password: str = os.getenv("BOOTSTRAP_OWNER_PASSWORD", "ChangeMeNow!123")

settings = Settings()
