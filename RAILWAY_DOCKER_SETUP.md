# 🚂 Railway Deployment with Automatic Database Setup

This guide shows you how to deploy with **automatic database initialization** on Railway using Docker.

---

## 🎯 Option 1: Railway Nixpacks (Recommended - Simplest)

Railway automatically detects your project and builds it. Just need to run the schema manually **once**.

### Quick Setup:

1. **In Railway Dashboard:**
   - Go to your MySQL service
   - Click **"Query"** tab
   - Copy the entire contents of `database/schema.sql`
   - Paste and click **"Run Query"**
   - Done! ✅

2. **Verify:**
   ```bash
   # Run this query in Railway MySQL Query tab:
   SHOW TABLES;
   ```
   
   Should show 9 tables.

---

## 🐳 Option 2: Railway with Docker (Auto-Initialize)

Use Docker to automatically run the schema when deploying to Railway.

### Setup Steps:

#### 1. Create `railway.json` in backend directory:
```json
{
  "build": {
    "builder": "dockerfile",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "/app/docker-entrypoint.sh",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "on_failure",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 2. Commit and Push:
```bash
cd backend
git add Dockerfile docker-entrypoint.sh railway.json
git commit -m "Add Docker deployment with auto DB initialization"
git push origin main
```

#### 3. In Railway Dashboard:
- Go to backend service → **Settings**
- Under **"Builder"**, select: **Dockerfile**
- Under **"Start Command"**, enter: `/app/docker-entrypoint.sh`
- Click **"Redeploy"**

### What Happens:
1. Railway builds Docker image
2. Container starts
3. Script checks if database tables exist
4. If no tables, automatically runs `schema.sql`
5. Creates admin user and sample data
6. Starts the API server

---

## 🏠 Option 3: Local Docker (Development)

Perfect for local development with automatic setup.

### Quick Start (3 commands):
```bash
cd backend
cp .env.docker .env
docker compose up -d
```

**That's it!** Database automatically initialized.

### What You Get:
- ✅ MySQL 8.0 running on port 3306
- ✅ Backend API on port 5000
- ✅ All tables created automatically
- ✅ Admin user: `admin@dairysystem.com` / `admin123`
- ✅ Sample products loaded

### Useful Commands:
```bash
# View logs
docker compose logs -f

# Stop everything
docker compose down

# Fresh start (deletes database)
docker compose down -v
docker compose up -d

# Access database
docker exec -it dairy-mysql mysql -udairy_user -pdairy123 dairy_management
```

---

## 🔍 Verify Deployment Works

### Test Health Check:
```bash
curl https://your-backend.up.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-26T..."
}
```

### Test Database Connection:
```bash
curl https://your-backend.up.railway.app/api/v1/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### Test Login:
```bash
curl -X POST https://your-backend.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dairysystem.com",
    "password": "admin123"
  }'
```

Should return a JWT token.

---

## 📊 Compare Options

| Feature | Railway Nixpacks | Railway Docker | Local Docker |
|---------|-----------------|----------------|--------------|
| Setup Complexity | ⭐ Easiest | ⭐⭐ Medium | ⭐ Easiest |
| Auto DB Init | ❌ Manual once | ✅ Automatic | ✅ Automatic |
| Build Time | Fast | Medium | Fast |
| Best For | Quick deploy | Production | Development |
| Database Setup | Run SQL once | Automatic | Automatic |

---

## 🚀 Recommended Workflow

### For Railway Production:
**Option 1 (Simplest):**
1. Deploy with Railway Nixpacks (default)
2. Run `schema.sql` in Railway MySQL Query tab **once**
3. Done!

**Option 2 (Automated):**
1. Use Docker with `docker-entrypoint.sh`
2. Database automatically initializes on every fresh deployment
3. No manual SQL needed

### For Local Development:
**Use Docker Compose:**
```bash
cd backend
docker compose up -d
```
Everything just works!

---

## 🐛 Troubleshooting

### Railway Docker Build Fails
```bash
# Check Railway logs for:
- Docker build errors
- Missing schema.sql file
- Database connection timeout

# Solution:
- Ensure database/schema.sql exists
- Check DB environment variables are set
- Increase healthcheck timeout
```

### Schema Not Running Automatically
```bash
# Check entrypoint script logs in Railway:
docker-entrypoint.sh: line X: mysql: command not found

# Solution:
- Ensure Dockerfile has: RUN apk add mysql-client
- Check script has execute permission
```

### Database Connection Refused
```bash
# Wait longer - MySQL takes 30-60 seconds to start
# Check Railway DB environment variables:
- DB_HOST
- DB_USER  
- DB_PASSWORD
- DB_NAME
```

---

## ✅ Success Checklist

- [ ] Backend deploys successfully
- [ ] Health check returns 200 OK
- [ ] Database shows 9 tables
- [ ] Admin user can login
- [ ] No errors in Railway logs
- [ ] Frontend can connect to backend

---

## 📝 Summary

**Best Options:**

1. **Railway (Quick):** Use Nixpacks + run SQL manually once ⭐ **RECOMMENDED**
2. **Railway (Auto):** Use Docker with auto-init script
3. **Local Dev:** Use Docker Compose

All options work great! Choose based on your preference.

**Default Login:**
- Email: `admin@dairysystem.com`
- Password: `admin123`

🎉 **No more manual SQL queries after initial setup!**
