# 🎯 Railway Database - Quick Fix

## Your Error: Connection Refused

This means **Railway can't find your database**. Here's the fix:

---

## 🔴 Do You Have a MySQL Service?

### Look at Your Railway Project

```
Your Project Dashboard Should Show:
  📦 Backend (Node.js) ← Your current service
  🗄️  MySQL           ← DO YOU SEE THIS?
```

### ❌ If You DON'T See MySQL:

**YOU NEED TO ADD IT!**

1. Click **"+ New"**
2. Select **"Database"**
3. Choose **"Add MySQL"**
4. Wait 1-2 minutes

### ✅ If You DO See MySQL:

Continue to next section...

---

## 🔧 Fix Your Environment Variables

### Go to Backend Service → Variables

Add these **EXACT** mappings:

```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
```

### ⚠️ CRITICAL: Use This Exact Format

```
${{MySQL.MYSQLHOST}}
  ↑   ↑      ↑
  |   |      └─ Variable name from MySQL service
  |   └──────── Service name (usually "MySQL")
  └──────────── Railway variable reference syntax
```

**Common mistakes:**
- ❌ `MySQL.MYSQLHOST` (missing `${{}}`)
- ❌ `${MySQL.MYSQLHOST}` (wrong brackets)
- ❌ `{{MySQL.MYSQLHOST}}` (missing `$`)

---

## 📤 Deploy the Fix

### Step 1: Push Updated Code

```bash
cd /home/rumariza/dairy-management-system

# Add the fixed database config
git add backend/src/config/database.ts

# Commit
git commit -m "Fix: Support both DB variable name formats"

# Push (Railway auto-deploys)
git push origin main
```

### Step 2: Wait for Deployment

Railway will:
1. Detect the push
2. Build your backend
3. Deploy it (~2 minutes)

### Step 3: Check Logs

Go to **Backend Service → Logs**

You should see ONE of these:

#### ✅ Success:
```
✅ MySQL Connected: containers-us-west-xyz.railway.app:1234
```

#### ⚠️ Still Failing (but with helpful debug info):
```
❌ Error connecting to MySQL: Connection refused
⚠️  Please check your database configuration:
    DB_HOST: not set          ← If "not set", variables aren't mapped!
    DB_PORT: not set
    DB_USERNAME: not set
    DB_DATABASE: not set
```

---

## 🐛 If It Still Says "not set"

Your variables aren't mapped correctly. Double-check:

### 1. Variable Names Are Exact

Backend Service → Variables should show:

| Variable Name | Value |
|--------------|-------|
| DB_HOST | `${{MySQL.MYSQLHOST}}` |
| DB_PORT | `${{MySQL.MYSQLPORT}}` |
| DB_USERNAME | `${{MySQL.MYSQLUSER}}` |
| DB_PASSWORD | `${{MySQL.MYSQLPASSWORD}}` |
| DB_DATABASE | `${{MySQL.MYSQLDATABASE}}` |

### 2. MySQL Service Name

If your MySQL service has a different name (check the service card), update the references:

```env
# If your MySQL service is named "database"
DB_HOST=${{database.MYSQLHOST}}

# If it's named "MySQL" (default)
DB_HOST=${{MySQL.MYSQLHOST}}
```

### 3. MySQL Service Is Active

Go to MySQL service card - status should be **"Active"** (green dot)

If it says "Deploying" or "Error", wait or recreate it.

---

## 🎉 Once Connected

After you see:
```
✅ MySQL Connected: containers-us-west-xyz.railway.app:1234
```

### Initialize the Database Schema

Go to **MySQL Service → Query Tab**

Paste and execute the content from:
```
backend/database/schema.sql
```

This creates all tables and the default admin user.

### Test Your API

```bash
# Health check
curl https://your-app.railway.app/api/v1/health

# Login
curl -X POST https://your-app.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dairysystem.com","password":"admin123"}'
```

---

## 📋 Complete Checklist

- [ ] MySQL service exists in Railway
- [ ] MySQL service status is "Active"
- [ ] Backend has DB_HOST variable = `${{MySQL.MYSQLHOST}}`
- [ ] Backend has DB_PORT variable = `${{MySQL.MYSQLPORT}}`
- [ ] Backend has DB_USERNAME variable = `${{MySQL.MYSQLUSER}}`
- [ ] Backend has DB_PASSWORD variable = `${{MySQL.MYSQLPASSWORD}}`
- [ ] Backend has DB_DATABASE variable = `${{MySQL.MYSQLDATABASE}}`
- [ ] Pushed updated code to GitHub
- [ ] Railway deployed successfully
- [ ] Logs show "MySQL Connected" message
- [ ] Ran schema.sql in MySQL Query tab
- [ ] Can login with admin credentials

---

## 🆘 Still Not Working?

### Share Your Logs

Look at **Backend Service → Logs** and find:

```
⚠️  Please check your database configuration:
    DB_HOST: [shows what value it sees]
    DB_PORT: [shows what value it sees]
    DB_USERNAME: [shows what value it sees]
    DB_DATABASE: [shows what value it sees]
```

If they all say **"not set"**, your variable mappings are wrong.

### Screenshot Your Variables

Take a screenshot of:
- Railway project (showing both services)
- Backend Service → Variables tab
- MySQL Service → Variables tab

This will help debug the issue.

---

## 🎯 Summary

**The Problem:** Your backend can't connect to MySQL

**Most Common Cause:** 
1. No MySQL service added to Railway, OR
2. Environment variables not mapped correctly

**The Fix:**
1. ✅ Add MySQL service to Railway
2. ✅ Map variables using `${{MySQL.MYSQLHOST}}` format
3. ✅ Push updated database config code
4. ✅ Run schema.sql to create tables

**Expected Result:**
```
✅ MySQL Connected: containers-us-west-xyz.railway.app:1234
```

Follow the checklist above step by step! 🚀
