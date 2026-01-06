# Coolify Deployment Guide

## Architecture

```
┌─────────────────────────────────────────────────┐
│                 Hetzner VPS                      │
│  ┌─────────────────────────────────────────┐    │
│  │              Coolify                      │    │
│  │  ┌─────────────┐  ┌─────────────────┐   │    │
│  │  │  Frontend   │  │    Backend      │   │    │
│  │  │  (nginx)    │  │   (Node.js)     │   │    │
│  │  │   :443      │──│    :3000        │   │    │
│  │  └─────────────┘  └─────────────────┘   │    │
│  │                          │               │    │
│  │                   ┌──────┴──────┐       │    │
│  │                   │  PostgreSQL  │       │    │
│  │                   │    :5432     │       │    │
│  │                   └─────────────┘       │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

## Step 1: Hetzner Setup

1. Create a VPS (CX21 or higher recommended - 4GB RAM minimum)
2. Choose Ubuntu 22.04
3. Add your SSH key
4. Note the IP address

## Step 2: Install Coolify

SSH into your server:

```bash
ssh root@YOUR_IP
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Access Coolify at `http://YOUR_IP:8000`

## Step 3: Create PostgreSQL Database

1. In Coolify: **Resources** → **New** → **Database** → **PostgreSQL**
2. Name: `mindcase-db`
3. Note the connection credentials

## Step 4: Deploy Backend

1. **Resources** → **New** → **Application**
2. Source: **GitHub** → Select `punyopan/mindcase-1-`
3. Build Pack: **Dockerfile**
4. Dockerfile Location: `back_up_minecase/Dockerfile.backend`
5. Build Context: `back_up_minecase`
6. Port: `3000`

### Environment Variables (Backend)

Add these in Coolify's environment settings:

```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@mindcase-db:5432/mindcase
JWT_SECRET=your-super-secret-key-min-32-chars
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_MONTHLY_PRICE_ID=price_xxx
STRIPE_ANNUAL_PRICE_ID=price_xxx
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
FRONTEND_URL=https://yourdomain.com
```

## Step 5: Deploy Frontend

1. **Resources** → **New** → **Application**
2. Source: **GitHub** → Select `punyopan/mindcase-1-`
3. Build Pack: **Dockerfile**
4. Dockerfile Location: `back_up_minecase/Dockerfile.frontend`
5. Build Context: `back_up_minecase`
6. Port: `80`

## Step 6: Configure Domains

1. Point your domain to Hetzner VPS IP
2. In Coolify, add domain to each service:
   - Frontend: `yourdomain.com`
   - Backend: `api.yourdomain.com`
3. Enable HTTPS (Coolify handles Let's Encrypt automatically)

## Step 7: Update Frontend API URLs

Before deploying, update these files to use your production domain:

### `services/auth.js`

```javascript
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/auth"
    : "https://api.yourdomain.com/api/auth";
```

Or use a single domain with nginx proxying `/api` to backend.

## Step 8: Run Database Migrations

In Coolify, use the **Terminal** feature on the backend container:

```bash
cd /app
node -e "
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
})();
"
```

## Step 9: Configure Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://api.yourdomain.com/api/payment/webhook/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.*`
4. Copy webhook secret to Coolify env vars

## Step 10: Configure OAuth Redirects

Update Google Cloud Console:

- Authorized redirect URIs: `https://api.yourdomain.com/api/auth/google/callback`

---

## Single Domain Setup (Alternative)

If you want everything on one domain (recommended):

### nginx.conf (updated)

```nginx
location /api {
    proxy_pass http://backend:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

This way:

- `https://yourdomain.com` → Frontend
- `https://yourdomain.com/api` → Backend

And you only need one SSL certificate!
