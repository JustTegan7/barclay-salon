from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

Role = Literal["ADMIN", "OWNER", "EMPLOYEE"]

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class LoginOut(BaseModel):
    ok: bool
    token: Optional[str] = None
    role: Optional[Role] = None
    error: Optional[str] = None

class MeOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: Role

class CreateUserIn(BaseModel):
    email: EmailStr
    full_name: str
    role: Role
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: Role
    is_active: bool

class TimeOffCreateIn(BaseModel):
    start_date: str
    end_date: str
    reason: str = ""

class TimeOffOut(BaseModel):
    id: int
    employee_id: int
    start_date: str
    end_date: str
    reason: str
    status: str

class TimeOffDecisionIn(BaseModel):
    status: Literal["APPROVED", "DENIED"]
