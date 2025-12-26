# 🔧 Railway Backend Environment Variables - EXACT Setup

## ⚠️ The Problem:

Your backend code looks for these variables:
- `DB_HOST`
- `DB_PORT`
- `DB_USER` or `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME` or `DB_DATABASE`

Railway MySQL provides these:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`

**They don't match!** So backend can't find the database.

---

## ✅ Solution: Add These Variables to Backend Service

### Go to Railway Dashboard:

1. Open: https://railway.app/dashboard
2. Click your **Backend service** (dairy-management-api)
3. Go to **Variables** tab
4. Click **"+ New Variable"** for each of these:

### **Add These EXACT Variables:**

```bash
# Database Connection - Reference MySQL service
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=dairy_db

# Alternative names (backend checks both)
DB_DATABASE=dairy_db
DB_USERNAME=${{MySQL.MYSQLUSER}}
```

### **What These Mean:**

- `${{MySQL.MYSQLHOST}}` - Railway automatically fills this from your MySQL service
- `dairy_db` - The database name where we created your tables

---

## 📋 Step-by-Step:

### 1. Add DB_HOST:
- Name: `DB_HOST`
- Value: `${{MySQL.MYSQLHOST}}`
- Click "Add"

### 2. Add DB_PORT:
- Name: `DB_PORT`
- Value: `${{MySQL.MYSQLPORT}}`
- Click "Add"

### 3. Add DB_USER:
- Name: `DB_USER`
- Value: `${{MySQL.MYSQLUSER}}`
- Click "Add"

### 4. Add DB_PASSWORD:
- Name: `DB_PASSWORD`
- Value: `${{MySQL.MYSQLPASSWORD}}`
- Click "Add"

### 5. Add DB_NAME:
- Name: `DB_NAME`
- Value: `dairy_db` (type this exactly)
- Click "Add"

### 6. Backend Will Auto-Redeploy
- Wait ~2 minutes for deployment to finish

---

## 🧪 Verify It Works:

### Check Deployment Logs:

Look for these messages in Railway backend logs:
```
✅ MySQL Connected: mysql-ur4r.railway.internal:3306
✅ Database connected successfully
🚀 Server is running on port 5000
```

### Test Health:
```bash
curl https://dairy-management-api-production.up.railway.app/health
```

Should return: `{"status":"healthy"}`

### Test Login:
```bash
curl -X POST https://dairy-management-api-production.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dairysystem.com",
    "password": "admin123"
  }'
```

Should return JWT token!

---

## 🎯 Quick Reference:

**Your MySQL Connection String (for reference):**
```
mysql://root:GqsGfqozHbDVdoeqEWqaQfiCdqJaJopt@mysql-ur4r.railway.internal:3306/dairy_db
```

**Database Name:** `dairy_db` (NOT `railway`)

**Tables:** 9 tables already exist (users, products, clients, etc.)

**Admin User:** admin@dairysystem.com / admin123

---

## 🔍 Check Current Variables:

In Railway Backend Variables tab, you should see:

✅ `DB_HOST` = `${{MySQL.MYSQLHOST}}`
✅ `DB_PORT` = `${{MySQL.MYSQLPORT}}`
✅ `DB_USER` = `${{MySQL.MYSQLUSER}}`
✅ `DB_PASSWORD` = `${{MySQL.MYSQLPASSWORD}}`
✅ `DB_NAME` = `dairy_db`

Plus your other variables (JWT_SECRET, FRONTEND_URL, etc.)

---

## ⚡ After Adding Variables:

1. Backend automatically redeploys (~2 minutes)
2. Check logs for "✅ Database connected successfully"
3. Test login from frontend
4. 🎉 Should work!

---

## 🆘 Still Not Working?

### Check these:
1. **MySQL service is running** (green light in Railway)
2. **All 5 DB variables added** to backend service
3. **DB_NAME is exactly** `dairy_db` (not `railway`)
4. **Backend redeployed** after adding variables
5. **No typos** in variable names

### View Logs:
```bash
# In Railway dashboard:
Backend service → Deployments → Latest → View Logs
```

Look for error messages about database connection.

---

**Once you add these 5 variables, the 500 error will be fixed!** ✅
