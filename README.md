# Barclay Salon — Booking System

A full‑stack salon booking system built to support **guest appointment requests**, with a clean upgrade path to staff scheduling, authentication, and payments.

This project was built as a real‑world production exercise: ship something useful first, then design for growth.

---

## What This Project Does

**Today (V1)**

- Customers can browse services
- Submit a booking request (no account required)
- Requests are persisted to PostgreSQL
- Staff can view appointments via admin endpoints

**Designed for V2+**

- Staff & customer authentication (JWT + RBAC already scaffolded)
- Hairdresser availability & time‑off
- Conflict‑aware scheduling
- Payments and paystubs

---

## Tech Stack

**Frontend**

- React + TypeScript (Vite)
- Fetch‑based API client
- Component‑driven UI with modal booking flow

**Backend**

- Node.js + Express
- PostgreSQL (with in‑memory fallback for dev)
- pg Pool for DB access
- JWT auth scaffolding (not enforced in V1)

---

## Architecture Overview

```
Frontend (Vite + React)
   ↓ JSON
Express API
   ↓ SQL
PostgreSQL
```

Key design choice: **guest bookings first**. No auth required to request an appointment, reducing friction and increasing conversion.

---

## Project Structure

```
barclay-salon/
├── src/                  # Frontend (React)
│   ├── api/              # API client
│   ├── Components/       # UI components
│   ├── Pages/            # Route-level pages
│   ├── data/             # Service catalog
│   └── Styles/
│
├── Backend/
│   ├── src/
│   │   ├── server.js     # Express entrypoint
│   │   ├── db.js         # Postgres + schema init
│   │   ├── bookingController.js
│   │   └── authMiddleware.js
│   ├── sql/schema.sql    # Full future schema
│   └── .env.example
│
└── docker-compose.yml
```

---

## Getting Started (Local Dev)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/barclay-salon.git
cd barclay-salon
```

### 2. Backend setup

```bash
cd Backend
cp .env.example .env
npm install
npm run dev
```

Required env vars:

```
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgres://postgres:password@localhost:5432/barclay
JWT_SECRET=dev_secret
```

### 3. Frontend setup

```bash
npm install
npm run dev
```

Frontend runs on: [http://localhost:5173](http://localhost:5173)
Backend runs on: [http://localhost:4000](http://localhost:4000)

---

## API Endpoints (V1)

- `GET /health`
- `GET /services`
- `POST /api/appointments`
- `GET /api/admin/appointments`

Example booking request:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "serviceId": "all-over-color",
  "datetime": "2026-07-02T07:15:00Z"
}
```

---

## Database Notes

- Uses PostgreSQL when `DATABASE_URL` is present
- Falls back to in‑memory storage if DB is unavailable
- `schema.sql` contains the **future full schema**
- `initDb()` creates only minimal V1 tables automatically

This keeps development fast while preserving a clean migration path.

---

## What This Project Demonstrates

- End‑to‑end feature ownership (frontend → backend → DB)
- Pragmatic system design (ship V1, design for V2)
- API design with backward compatibility
- Defensive error handling and logging
- Real‑world booking constraints

---

## Planned Improvements

- Replace mock services with DB‑backed services
- Enforce auth on admin routes
- Time‑slot conflict detection
- Hairdresser scheduling UI
- Email confirmations

---

## License

MIT
