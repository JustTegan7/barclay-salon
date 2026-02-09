from sqlmodel import Session, select
from .models import User
from .security import hash_password
from .config import settings

def bootstrap_users(session: Session) -> None:
    # If any users exist, assume bootstrapped already.
    existing = session.exec(select(User)).first()
    if existing:
        return

    admin = User(
        email=settings.bootstrap_admin_email.lower(),
        full_name="Admin",
        role="ADMIN",
        password_hash=hash_password(settings.bootstrap_admin_password),
        is_active=True,
    )
    owner = User(
        email=settings.bootstrap_owner_email.lower(),
        full_name="Ryan (Owner)",
        role="OWNER",
        password_hash=hash_password(settings.bootstrap_owner_password),
        is_active=True,
    )

    session.add(admin)
    session.add(owner)
    session.commit()
