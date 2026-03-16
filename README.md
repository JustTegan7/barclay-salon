# Barclay's Salon

Family-owned Redken Club 5th Avenue salon in Everett, WA since 1977.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon hosted)
- **Hosting**: Vercel (frontend + backend)
- **Auth**: JWT with role-based access (ADMIN, OWNER, HAIRDRESSER)

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd Backend
npm install
npm run dev
```

### Environment Variables

**Frontend** (`.env` in project root):
```
VITE_API_URL=http://localhost:4000
```

**Backend** (`Backend/.env`):
```
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-here
DATABASE_URL=postgresql://...
```

## Deployment

See `DEPLOY.md` for full Vercel deployment instructions.

## Roles

| Role | Access |
|------|--------|
| ADMIN | Full access — all appointments, manage staff, approve time off |
| OWNER | Same as ADMIN |
| HAIRDRESSER | Own schedule, time-off requests, profile |

## Contact

Barclay's Salon · 320 112th Street SW, Everett WA 98204 · 425-353-1244
