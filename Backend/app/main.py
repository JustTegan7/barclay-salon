from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from .db import engine, create_db_and_tables
from .bootstrap import bootstrap_users
from .models import User, TimeOffRequest
from .security import verify_password, create_access_token, hash_password
from .schemas import (
    LoginIn, LoginOut, MeOut,
    CreateUserIn, UserOut,
    TimeOffCreateIn, TimeOffOut, TimeOffDecisionIn
)
from .deps import get_current_user, require_roles

app = FastAPI(title="Barclay Auth + Staff Portal API", version="0.1.0")

# Adjust for your deployed frontend domain later.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    with Session(engine) as session:
        bootstrap_users(session)

@app.get("/health")
def health():
    return {"ok": True}

# -----------------------
# Auth
# -----------------------
@app.post("/auth/login", response_model=LoginOut)
def login(payload: LoginIn):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == payload.email.lower())).first()
        if not user or not user.is_active:
            return LoginOut(ok=False, error="Invalid credentials")

        if not verify_password(payload.password, user.password_hash):
            return LoginOut(ok=False, error="Invalid credentials")

        token = create_access_token(sub=user.email, role=user.role)
        return LoginOut(ok=True, token=token, role=user.role)

@app.get("/auth/me", response_model=MeOut)
def me(user: User = get_current_user):
    return MeOut(id=user.id, email=user.email, full_name=user.full_name, role=user.role)

# -----------------------
# Users (Admin / Owner)
# -----------------------
@app.post("/users", response_model=UserOut)
def create_user(
    payload: CreateUserIn,
    _user: User = require_roles("ADMIN", "OWNER"),
):
    with Session(engine) as session:
        existing = session.exec(select(User).where(User.email == payload.email.lower())).first()
        if existing:
            return UserOut(id=existing.id, email=existing.email, full_name=existing.full_name, role=existing.role, is_active=existing.is_active)

        u = User(
            email=payload.email.lower(),
            full_name=payload.full_name,
            role=payload.role,
            password_hash=hash_password(payload.password),
            is_active=True,
        )
        session.add(u)
        session.commit()
        session.refresh(u)
        return UserOut(id=u.id, email=u.email, full_name=u.full_name, role=u.role, is_active=u.is_active)

@app.get("/users", response_model=list[UserOut])
def list_users(_user: User = require_roles("ADMIN", "OWNER")):
    with Session(engine) as session:
        users = session.exec(select(User).order_by(User.created_at.desc())).all()
        return [UserOut(id=u.id, email=u.email, full_name=u.full_name, role=u.role, is_active=u.is_active) for u in users]

# -----------------------
# Time off requests
# -----------------------
@app.post("/time-off", response_model=TimeOffOut)
def create_time_off(
    payload: TimeOffCreateIn,
    user: User = require_roles("EMPLOYEE", "OWNER", "ADMIN"),
):
    # Employees create requests for themselves. Owner/Admin can too (useful for demo).
    with Session(engine) as session:
        r = TimeOffRequest(
            employee_id=user.id,
            start_date=payload.start_date,
            end_date=payload.end_date,
            reason=payload.reason,
            status="PENDING",
        )
        session.add(r)
        session.commit()
        session.refresh(r)
        return TimeOffOut(
            id=r.id,
            employee_id=r.employee_id,
            start_date=r.start_date,
            end_date=r.end_date,
            reason=r.reason,
            status=r.status,
        )

@app.get("/time-off", response_model=list[TimeOffOut])
def list_time_off(user: User = get_current_user):
    with Session(engine) as session:
        if user.role in ("ADMIN", "OWNER"):
            reqs = session.exec(select(TimeOffRequest).order_by(TimeOffRequest.created_at.desc())).all()
        else:
            reqs = session.exec(select(TimeOffRequest).where(TimeOffRequest.employee_id == user.id).order_by(TimeOffRequest.created_at.desc())).all()

        return [
            TimeOffOut(
                id=r.id,
                employee_id=r.employee_id,
                start_date=r.start_date,
                end_date=r.end_date,
                reason=r.reason,
                status=r.status,
            )
            for r in reqs
        ]

@app.post("/time-off/{request_id}/decision", response_model=TimeOffOut)
def decide_time_off(
    request_id: int,
    payload: TimeOffDecisionIn,
    _user: User = require_roles("ADMIN", "OWNER"),
):
    with Session(engine) as session:
        r = session.get(TimeOffRequest, request_id)
        if not r:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Not found")
        r.status = payload.status
        session.add(r)
        session.commit()
        session.refresh(r)
        return TimeOffOut(
            id=r.id,
            employee_id=r.employee_id,
            start_date=r.start_date,
            end_date=r.end_date,
            reason=r.reason,
            status=r.status,
        )
