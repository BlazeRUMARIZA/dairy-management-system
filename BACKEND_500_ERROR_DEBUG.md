# 🔴 500 Internal Server Error - Backend Debugging

## The Error

```
POST /api/v1/auth/login 500 (Internal Server Error)
Error: Server error
```

This means your backend is crashing when trying to login.

---

## 🔍 Check Railway Backend Logs (DO THIS FIRST)

### Go to Railway Dashboard

1. Click on your **Backend service**
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. Click **"View Logs"**

### Look for These Errors

#### Error 1: Database Connection Failed
```
❌ Error connecting to MySQL: Connection refused
❌ Error connecting to MySQL: Access denied
```

**Cause:** Database not connected

**Fix:** Add database (see below)

#### Error 2: JWT Secret Missing
```
❌ Error: JWT_SECRET is not defined
❌ Cannot read property 'sign' of undefined
```

**Cause:** Missing `JWT_SECRET` environment variable

**Fix:** Add JWT_SECRET (see below)

#### Error 3: User Table Doesn't Exist
```
❌ Table 'dairy_db.users' doesn't exist
❌ ER_NO_SUCH_TABLE
```

**Cause:** Database tables not created

**Fix:** Run schema.sql (see below)

---

## ✅ Fix 1: Add Required Environment Variables

### Go to Backend Service → Variables

Make sure these exist:

```env
# Server
NODE_ENV=production
PORT=5000

# JWT (CRITICAL!)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRE=7d

# Frontend (for CORS)
FRONTEND_URL=https://dairy-management-frontend-production.up.railway.app

# Database (if using Railway MySQL)
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
```

### If JWT_SECRET is missing:

Add it now:
```env
JWT_SECRET=dairy-management-2025-secret-key-change-this-in-production-min-32-chars
```

Railway will auto-redeploy.

---

## ✅ Fix 2: Add MySQL Database

### Check if MySQL Service Exists

In your Railway project, do you see a **MySQL service**?

```
Your Railway Project Should Have:
  ├─ Frontend Service ✅
  ├─ Backend Service ✅
  └─ MySQL Service ❓ ← DO YOU HAVE THIS?
```

### If MySQL Service is Missing:

1. In Railway dashboard, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add MySQL"**
4. Wait for it to provision (~1 minute)

### Link MySQL to Backend:

After MySQL is added:

1. Go to **Backend service** → **"Variables"**
2. Add these:
   ```env
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_USERNAME=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_DATABASE=${{MySQL.MYSQLDATABASE}}
   ```

Railway will auto-redeploy.

---

## ✅ Fix 3: Initialize Database Schema

After MySQL is connected, you need to create the tables.

### Option 1: Railway MySQL Query Tab

1. Go to **MySQL service** in Railway
2. Click **"Query"** tab
3. Copy the entire contents of `backend/database/schema.sql`
4. Paste into the query box
5. Click **"Run"** or **"Execute"**

This creates all tables + default admin user.

### Option 2: Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to MySQL and run schema
railway connect MySQL
# Then in MySQL prompt:
source /path/to/backend/database/schema.sql
```

---

## 🔍 Debug Steps

### Step 1: Check Backend is Running

```bash
curl https://dairy-management-api-production.up.railway.app/api/v1/health
```

**Expected:**
```json
{
  "success": true,
  "message": "API is running"
}
```

**If this fails:** Backend isn't running at all

### Step 2: Check Backend Logs

Railway → Backend → Deployments → View Logs

**Look for:**

✅ Good logs:
```
╔════════════════════════════════════════╗
║   🥛 Dairy Management System API      ║
║   Server running on port 5000          ║
║   Environment: production              ║
╚════════════════════════════════════════╝

✅ MySQL Connected: containers-us-west-xyz.railway.app:3306
🔐 CORS allowed origins: [...]
```

❌ Bad logs:
```
❌ Database connection failed
❌ JWT_SECRET is not defined
❌ Table doesn't exist
```

### Step 3: Test Login from Command Line

```bash
curl -X POST https://dairy-management-api-production.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dairysystem.com","password":"admin123"}' \
  -v
```

**Expected Success:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@dairysystem.com",
    "role": "admin"
  }
}
```

**If 500 Error:**
Check response body for error message.

---

## 📋 Complete Railway Backend Setup Checklist

- [ ] Backend service deployed and running
- [ ] MySQL service added to Railway project
- [ ] Backend has all required environment variables:
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL` (frontend URL)
  - [ ] `DB_HOST=${{MySQL.MYSQLHOST}}`
  - [ ] `DB_PORT=${{MySQL.MYSQLPORT}}`
  - [ ] `DB_USERNAME=${{MySQL.MYSQLUSER}}`
  - [ ] `DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}`
  - [ ] `DB_DATABASE=${{MySQL.MYSQLDATABASE}}`
- [ ] Database schema created (ran `schema.sql`)
- [ ] Backend logs show "MySQL Connected"
- [ ] Health check returns 200 OK
- [ ] Login endpoint returns token

---

## 🎯 Most Likely Issue

Based on the 500 error, **most likely one of these:**

### 1. JWT_SECRET Missing (80% probability)

**Symptom:** Login crashes immediately
**Fix:** Add `JWT_SECRET` to environment variables
**Test:** Check logs for JWT error

### 2. Database Not Connected (15% probability)

**Symptom:** Can't query users table
**Fix:** Add MySQL service + environment variables
**Test:** Check logs for "Database connection failed"

### 3. Tables Don't Exist (5% probability)

**Symptom:** "Table doesn't exist" error
**Fix:** Run `schema.sql`
**Test:** Check logs for "ER_NO_SUCH_TABLE"

---

## 🚀 Quick Action

**RIGHT NOW, do this:**

1. **Check Railway backend logs** - What's the actual error?
2. **Copy/paste the error message** here so I can help
3. **Check if `JWT_SECRET` exists** in environment variables
4. **Check if MySQL service exists** in your Railway project

**Share what you find and I'll give you the exact fix!** 🔍
