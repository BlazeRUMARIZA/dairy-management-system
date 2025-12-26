# 🔍 Railway Database Connection - Debug Guide

## Your Current Error

```
❌ Error connecting to MySQL: ConnectionRefusedError [SequelizeConnectionRefusedError]
```

This means **the database connection is being refused**. Here's how to fix it:

---

## ✅ Solution 1: Check if MySQL Service Exists

### Step 1: Go to Railway Dashboard

Look at your project - do you see **TWO services**?

```
Your Railway Project Should Have:
  ├─ 🟢 Backend Service (your Node.js app)
  └─ 🟢 MySQL Service (database)
```

### If You DON'T See MySQL Service:

1. Click **"+ New"** in Railway
2. Select **"Database"**
3. Choose **"Add MySQL"**
4. Wait for it to provision (~1 minute)

---

## ✅ Solution 2: Check Environment Variables

### Step 1: Click on Your Backend Service

Go to **"Variables"** tab

### Step 2: Verify These Variables Exist

You need EITHER set A OR set B:

**Set A (Recommended - Direct Values):**
```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
```

**Set B (Alternative - Old Names):**
```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
```

### Step 3: Variable Mapping Format

**IMPORTANT:** Use the exact format `${{MySQL.VARIABLE_NAME}}`

❌ **WRONG:**
```env
DB_HOST=MySQL.MYSQLHOST
DB_HOST=${MySQL.MYSQLHOST}
DB_HOST={{MySQL.MYSQLHOST}}
```

✅ **CORRECT:**
```env
DB_HOST=${{MySQL.MYSQLHOST}}
```

---

## ✅ Solution 3: Wait for MySQL to Be Ready

After adding MySQL service:

1. **Wait 1-2 minutes** for MySQL to provision
2. MySQL status should show **"Active"** (green)
3. Then redeploy your backend

---

## ✅ Solution 4: Check Railway MySQL Service Variables

### Go to MySQL Service → Variables Tab

You should see these **provided by Railway**:

```
MYSQLHOST=containers-us-west-xyz.railway.app
MYSQLPORT=1234
MYSQLUSER=root
MYSQLDATABASE=railway
MYSQLPASSWORD=random_password_here
MYSQL_URL=mysql://root:password@host:port/database
```

If these DON'T exist, your MySQL service didn't provision correctly. Try:
1. Delete the MySQL service
2. Add it again: **"+ New"** → **"Database"** → **"Add MySQL"**

---

## ✅ Solution 5: Test Database Connection

### Option A: Railway MySQL Query Tab

1. Go to MySQL service
2. Click **"Query"** tab
3. Try running: `SHOW DATABASES;`
4. If it works, MySQL is running fine

### Option B: Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Connect to MySQL
railway run mysql -u $MYSQLUSER -p$MYSQLPASSWORD -h $MYSQLHOST -P $MYSQLPORT
```

If this connects, then your issue is variable mapping.

---

## 🔧 What I Just Fixed in Your Code

I updated `backend/src/config/database.ts` to:

1. **Support both variable name formats:**
   - `DB_USERNAME` (new)
   - `DB_USER` (old)
   - `DB_DATABASE` (new)
   - `DB_NAME` (old)

2. **Show helpful debug info on connection failure:**
   ```
   ⚠️  Server will continue running without database
   ⚠️  Please check your database configuration:
       DB_HOST: not set
       DB_PORT: not set
       DB_USERNAME: not set
       DB_DATABASE: not set
   ```

3. **Don't crash the server** if database fails to connect

---

## 📋 Complete Railway Setup Checklist

### ☑️ Step 1: Add MySQL Service

```
Railway Dashboard
  → "+ New"
  → "Database"
  → "Add MySQL"
  → Wait for "Active" status
```

### ☑️ Step 2: Set Backend Variables

```
Backend Service → Variables → Add:

DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}

NODE_ENV=production
JWT_SECRET=your-secret-key-min-32-characters
FRONTEND_URL=https://your-frontend.com
```

### ☑️ Step 3: Initialize Database Schema

```
MySQL Service → Query tab → Paste and Execute:

Content from: backend/database/schema.sql
```

### ☑️ Step 4: Redeploy Backend

```
Backend Service → Deployments → Click "Redeploy"
Or just push to GitHub (auto-deploys)
```

### ☑️ Step 5: Check Logs

```
Backend Service → Logs

Look for:
✅ Server running on port 5000
✅ MySQL Connected: containers-us-west-xyz.railway.app:1234
```

---

## 🎯 Expected Good Logs

After correct setup, you should see:

```
╔════════════════════════════════════════╗
║   🥛 Dairy Management System API      ║
║   Server running on port 5000          ║
║   Environment: production              ║
╚════════════════════════════════════════╝

✅ MySQL Connected: containers-us-west-xyz.railway.app:1234
⏸️  Cron jobs disabled
```

---

## 🚨 Common Mistakes

### Mistake 1: Variable Format
```env
# ❌ WRONG
DB_HOST=MySQL.MYSQLHOST

# ✅ CORRECT
DB_HOST=${{MySQL.MYSQLHOST}}
```

### Mistake 2: Missing MySQL Service
- You MUST have a MySQL service in Railway
- It's not automatic - you must add it manually

### Mistake 3: Wrong Variable Names
```env
# Your backend expects one of these:
DB_USERNAME (preferred)
DB_USER (also works)

# Railway provides:
MYSQLUSER

# So you map:
DB_USERNAME=${{MySQL.MYSQLUSER}}
```

### Mistake 4: MySQL Not Ready
- After adding MySQL, wait 1-2 minutes
- Check MySQL service status is "Active"
- Then redeploy backend

---

## 🔍 Debug: Show Current Configuration

After deploying, check your logs. They will now show:

```
❌ Error connecting to MySQL: Connection refused
⚠️  Server will continue running without database
⚠️  Please check your database configuration:
    DB_HOST: not set
    DB_PORT: not set
    DB_USERNAME: not set
    DB_DATABASE: not set
```

If it says **"not set"**, your variables aren't mapped correctly.

---

## 📞 Next Steps

1. **Push the fixed code:**
   ```bash
   git add backend/src/config/database.ts
   git commit -m "Fix: Support both DB_USERNAME and DB_USER variables"
   git push origin main
   ```

2. **Verify MySQL service exists** in Railway

3. **Check variable mappings** use `${{MySQL.VARIABLE}}` format

4. **Wait for deployment** and check logs

5. **Look for connection success** message

---

## ✨ After This Works

Once you see:
```
✅ MySQL Connected: containers-us-west-xyz.railway.app:1234
```

Then:
1. Test health check: `https://your-app.railway.app/api/v1/health`
2. Test login: Use Postman or your frontend
3. Run schema.sql if tables don't exist

Your database will be fully connected! 🎉
