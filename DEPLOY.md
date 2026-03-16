# Deploying Barclay's Salon to Vercel

## Before you push to GitHub

### 1. Reset your Neon password
Go to neon.tech → your project → Settings → Reset password
Update your local backend/.env with the new password.

### 2. Generate a strong JWT secret
Run this in your terminal:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Save the output — you'll need it in Vercel.

### 3. Make sure .gitignore is in place
The .gitignore file should exclude:
- .env files
- node_modules
- backend/src/seed.js

---

## Push to GitHub

```bash
git add .
git commit -m "feat: prepare for Vercel deployment"
git push origin main
```

---

## Set up Vercel

1. Go to vercel.com → Add New Project
2. Import your GitHub repo
3. Vercel will auto-detect the framework (Vite)
4. **Before clicking Deploy**, go to Environment Variables and add:

| Variable | Value |
|----------|-------|
| VITE_API_URL | https://your-project.vercel.app |
| DATABASE_URL | your Neon connection string |
| JWT_SECRET | your generated secret |
| CLIENT_ORIGIN | https://your-project.vercel.app |

5. Click Deploy

---

## After first deploy

Run the seed script once against your Neon database to create
your admin/owner accounts:

```bash
# Update backend/.env DATABASE_URL to point to Neon
# then run:
cd backend
node src/seed.js
```

---

## Auto-deploys
Every time you push to main, Vercel will auto-rebuild and redeploy.
No manual steps needed after the first setup.
