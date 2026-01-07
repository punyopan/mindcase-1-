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

---

## Updates & Continuous Deployment

### Automatic Deploys (Recommended)

Coolify can auto-deploy when you push to GitHub:

1. In your app settings → **Webhooks**
2. Copy the webhook URL
3. Go to GitHub repo → **Settings** → **Webhooks** → **Add webhook**
4. Paste URL, select `push` events
5. Now every `git push` triggers a rebuild

### Manual Deploy

```bash
# On your local machine
git add .
git commit -m "your changes"
git push origin main

# Then in Coolify:
# Click "Redeploy" button on the application
```

### Zero-Downtime Updates

Coolify supports rolling updates:

1. App Settings → **Health Checks** → Enable
2. New container starts, old one stops only after health check passes

---

## Debugging Production Issues

### 1. View Live Logs

In Coolify:

- Select your app → **Logs** tab
- Shows real-time stdout/stderr

Or via SSH:

```bash
ssh root@YOUR_IP
docker logs -f $(docker ps -qf "name=backend") --tail 100
```

### 2. Access Container Terminal

Coolify → Select app → **Terminal** tab

Or via SSH:

```bash
docker exec -it $(docker ps -qf "name=backend") sh
```

### 3. Check Database

```bash
# From backend container terminal
node -e "
const db = require('./src/db');
db.query('SELECT COUNT(*) FROM t_users').then(r => {
  console.log('Users:', r.rows[0].count);
  process.exit(0);
});
"
```

### 4. Common Issues & Fixes

| Issue                | Check                          | Fix                            |
| -------------------- | ------------------------------ | ------------------------------ |
| 500 errors           | Logs for stack trace           | Fix code, redeploy             |
| DB connection failed | `DATABASE_URL` env var         | Verify credentials             |
| OAuth not working    | Callback URL in Google Console | Update to production URL       |
| Cookies not working  | `FRONTEND_URL` matches domain  | Update env var                 |
| Stripe webhook fails | Webhook secret matches         | Update `STRIPE_WEBHOOK_SECRET` |

### 5. Enable Debug Logging

Temporarily add to backend env vars:

```
DEBUG=*
LOG_LEVEL=debug
```

Then redeploy and check logs.

---

## Rollback to Previous Version

### Quick Rollback in Coolify

1. App Settings → **Deployments** tab
2. Find previous successful deployment
3. Click **Rollback**

### Git-based Rollback

```bash
# Find previous commit
git log --oneline -10

# Revert to specific commit
git revert HEAD
git push origin main

# Or hard reset (destructive)
git reset --hard <commit-hash>
git push --force origin main
```

---

## Monitoring & Alerts

### 1. Coolify Built-in Monitoring

- CPU, Memory, Network usage per container
- Available in app dashboard

### 2. Health Check Endpoints

Backend already has:

- `GET /` - Returns service status

Add custom health check:

```javascript
// In backend/src/index.js
app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "healthy", db: "connected" });
  } catch (e) {
    res.status(500).json({ status: "unhealthy", error: e.message });
  }
});
```

### 3. External Monitoring (Free Options)

- **UptimeRobot** - Free ping monitoring, alerts via email/SMS
- **BetterStack** - Free tier with nice dashboard
- **Sentry** - Error tracking (add to frontend & backend)

#### Add Sentry Error Tracking

```bash
npm install @sentry/node
```

```javascript
// backend/src/index.js (top of file)
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });

// Add error handler at the end
app.use(Sentry.Handlers.errorHandler());
```

### 4. Log Aggregation

For searching through logs:

- **Loki + Grafana** (self-hosted, free)
- **Papertrail** (cloud, free tier)

---

## Database Backup & Restore

### Manual Backup

```bash
# SSH into server
ssh root@YOUR_IP

# Find PostgreSQL container
docker exec $(docker ps -qf "name=postgres") pg_dump -U postgres mindcase > backup_$(date +%Y%m%d).sql
```

### Automated Backups

In Coolify:

1. Database → **Backups** tab
2. Enable scheduled backups
3. Configure S3/local storage

### Restore from Backup

```bash
docker exec -i $(docker ps -qf "name=postgres") psql -U postgres mindcase < backup.sql
```

---

## Scaling (When You Grow)

### Vertical Scaling (Bigger Server)

1. Hetzner → Resize VPS
2. More CPU/RAM = handles more users

### Horizontal Scaling

1. Multiple backend containers (Coolify supports this)
2. Add Redis for session storage
3. Use connection pooler (PgBouncer) for database

### CDN for Frontend

1. Put Cloudflare in front of your domain
2. Cache static assets globally
3. Free tier handles most traffic
