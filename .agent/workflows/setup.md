---
description: how to set up the project on a new device
---

# MindCase Setup Guide

## Prerequisites

- Node.js v18+ installed
- PostgreSQL database (local or cloud like Supabase/Neon)
- Doppler CLI installed (for secrets management)
- Git installed

## Step 1: Clone Repository

```bash
git clone https://github.com/punyopan/mindcase-1-.git
cd mindcase-1-
```

## Step 2: Install Dependencies

```bash
# Install root dependencies (concurrently)
cd back_up_minecase
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## Step 3: Configure Doppler (Secrets Management)

```bash
# Login to Doppler
doppler login

# Setup project in backend folder
cd backend
doppler setup
# Select your project and environment (dev/prod)
cd ..
```

### Required Environment Variables in Doppler:

| Variable                  | Description                                 |
| ------------------------- | ------------------------------------------- |
| `DATABASE_URL`            | PostgreSQL connection string                |
| `JWT_SECRET`              | Secret for JWT token signing (min 32 chars) |
| `STRIPE_SECRET_KEY`       | Stripe API secret key                       |
| `STRIPE_WEBHOOK_SECRET`   | Stripe webhook signing secret               |
| `STRIPE_MONTHLY_PRICE_ID` | Stripe price ID for monthly plan            |
| `STRIPE_ANNUAL_PRICE_ID`  | Stripe price ID for annual plan             |
| `GOOGLE_CLIENT_ID`        | Google OAuth client ID                      |
| `GOOGLE_CLIENT_SECRET`    | Google OAuth client secret                  |
| `FRONTEND_URL`            | Frontend URL (e.g., http://localhost:5501)  |

## Step 4: Set Up Database

Run all migrations in order:

```bash
cd backend

# Connect to your PostgreSQL and run migrations
# Option 1: Using psql
psql $DATABASE_URL -f migrations/init_sessions.sql
psql $DATABASE_URL -f migrations/init_login_history.sql
psql $DATABASE_URL -f migrations/init_entitlements.sql
psql $DATABASE_URL -f migrations/init_tokens.sql
psql $DATABASE_URL -f migrations/init_2fa.sql
psql $DATABASE_URL -f migrations/init_streaks.sql
psql $DATABASE_URL -f migrations/init_progress_sync.sql

# Option 2: Using Doppler + node (if psql not available)
doppler run -- node -e "
const fs = require('fs');
const db = require('./src/db');
const files = [
  'init_sessions.sql',
  'init_login_history.sql',
  'init_entitlements.sql',
  'init_tokens.sql',
  'init_2fa.sql',
  'init_streaks.sql',
  'init_progress_sync.sql'
];
(async () => {
  for (const file of files) {
    const sql = fs.readFileSync('./migrations/' + file, 'utf8');
    await db.query(sql);
    console.log('✅', file);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
"
```

## Step 5: Run the Application

```bash
# From back_up_minecase folder
npm run dev
```

This starts:

- Backend on http://localhost:3000
- Opens frontend in browser

## Step 6: Access the App

// turbo
Open browser to: **http://localhost:5501/prod.html**

> ⚠️ **Important**: Always use `localhost` (not `127.0.0.1`) for cookies to work properly with OAuth.

## Troubleshooting

### "Failed to fetch" errors

- Ensure backend is running on port 3000
- Check that you're using `localhost` not `127.0.0.1`

### Database connection errors

- Verify `DATABASE_URL` in Doppler is correct
- Ensure PostgreSQL is running and accessible

### OAuth not working

- Check Google OAuth credentials in Doppler
- Ensure callback URLs are configured in Google Cloud Console:
  - `http://localhost:3000/api/auth/google/callback`
