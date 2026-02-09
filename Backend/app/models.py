from __future__ import annotations
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    full_name: str
    role: str = Field(index=True)  # ADMIN | OWNER | EMPLOYEE
    password_hash: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TimeOffRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: int = Field(index=True, foreign_key="user.id")
    start_date: str  # YYYY-MM-DD (simple for v1)
    end_date: str    # YYYY-MM-DD
    reason: str = ""
    status: str = Field(default="PENDING", index=True)  # PENDING | APPROVED | DENIED
    created_at: datetime = Field(default_factory=datetime.utcnow)
