# 🔍 How to Get Railway Backend Logs

## Step-by-Step: Find the Real Error

### 1. Go to Railway Dashboard
Open: https://railway.app

### 2. Find Your Backend Service
Click on the service that's running your **backend** (API)
- Look for the one with domain like: `dairy-management-api-production.up.railway.app`

### 3. Open Deployments
Click on the **"Deployments"** tab

### 4. View Latest Logs
1. Find the most recent deployment (top of list)
2. Click on it
3. Click **"View Logs"** button

### 5. Look for Error Messages

Scroll through the logs and look for:

#### Common Error 1: JWT Secret Missing
```
❌ Error: JWT_SECRET is not defined in environment variables
❌ Cannot sign token: secret or private key must be provided
```

#### Common Error 2: Database Connection
```
❌ Error connecting to MySQL: ECONNREFUSED
❌ Error connecting to MySQL: Access denied for user
❌ Database connection failed: connect ETIMEDOUT
```

#### Common Error 3: Table Missing
```
❌ ER_NO_SUCH_TABLE: Table 'dairy_db.users' doesn't exist
❌ Table 'railway.users' doesn't exist
```

#### Common Error 4: Password Hash Issue
```
❌ Error in login: data and hash arguments required
❌ bcrypt: data must be a string or Buffer and salt must either be a salt string or a number of rounds
```

### 6. Copy the Error Message

Copy the **ENTIRE** error message and share it with me.

---

## 🎯 Quick Test: Backend Health Check

Open this in your browser or run in terminal:

```bash
curl https://dairy-management-api-production.up.railway.app/api/v1/health
```

**If this works (returns JSON):**
- Backend is running ✅
- Database might be the issue

**If this fails:**
- Backend isn't starting properly ❌
- Check deployment logs

---

## 🔧 Quick Fixes While You Check

### Add JWT_SECRET (Most Common Issue)

1. Railway Dashboard → Backend service
2. **"Variables"** tab
3. Add:
   ```
   JWT_SECRET=dairy-2025-super-secret-key-minimum-32-characters-required
   ```
4. Save (auto-redeploys)

### Check Database Variables

Make sure these exist:
```
DB_HOST
DB_PORT  
DB_USERNAME
DB_PASSWORD
DB_DATABASE
```

If missing, you need to add MySQL service first.

---

## 📝 What to Share

Please share:

1. **Backend logs** - The actual error message (red text)
2. **Health check result** - Does `/api/v1/health` work?
3. **Environment variables** - Do you have `JWT_SECRET`?

I'll diagnose the exact issue once I see the logs! 🔍
