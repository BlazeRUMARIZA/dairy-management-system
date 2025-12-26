# 🚂 Railway Backend + Railway Frontend - CORS Fix

## Your Setup

✅ **Frontend:** Railway → `https://dairy-management-frontend-production.up.railway.app`
✅ **Backend:** Railway → (your backend URL)

Both on Railway - perfect! But CORS needs to be configured.

---

## 🔧 Fix CORS on Railway Backend

### Step 1: Find Your Backend Service on Railway

1. Go to https://railway.app
2. Find your project
3. You should see **TWO services**:
   - Frontend service (the one with your frontend URL)
   - Backend service (your API)

### Step 2: Add Environment Variable to Backend

1. Click on your **Backend service**
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add:

```env
Variable: FRONTEND_URL
Value:    https://dairy-management-frontend-production.up.railway.app
```

5. Click **"Add"** or **"Save"**

Railway will **automatically redeploy** your backend (~2 minutes)

---

## 📍 Find Your Backend URL

You need to know your backend's Railway URL.

### Option 1: Railway Dashboard

1. Click on your **Backend service**
2. Look for **"Domains"** section
3. You'll see something like:
   ```
   https://dairy-management-backend-production.up.railway.app
   ```
   or
   ```
   https://your-project-name.railway.app
   ```

### Option 2: Check Settings

1. Backend service → **"Settings"** tab
2. Scroll to **"Domains"** section
3. Copy your backend URL

---

## 🔗 Update Frontend to Use Railway Backend

Your frontend is probably still pointing to Render!

### Update Frontend Environment Variable

1. Go to your **Frontend service** on Railway
2. Go to **"Variables"** tab
3. Find or add:

```env
Variable: VITE_API_URL
Value:    https://YOUR-BACKEND-URL.railway.app
```

**Replace `YOUR-BACKEND-URL` with your actual backend Railway URL!**

4. Click **"Add"** or **"Save"**

Railway will redeploy frontend (~2 minutes)

---

## 🎯 Complete Railway Setup

### Backend Service Environment Variables

```env
# Server
NODE_ENV=production
PORT=5000

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=https://dairy-management-frontend-production.up.railway.app

# Database (from Railway MySQL service)
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}

# Optional: Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional: CRON
CRON_ENABLED=false
```

### Frontend Service Environment Variables

```env
# Point to your Railway backend
VITE_API_URL=https://YOUR-BACKEND-URL.railway.app
```

---

## ⏰ After Variables Are Set

Railway will auto-redeploy both services:

1. **Backend deploys first** (~2 minutes)
   - Logs will show: `🔐 CORS allowed origins: [...]`
   - Should include your frontend URL

2. **Frontend deploys** (~2 minutes)
   - Will now make requests to correct backend URL

Total time: ~3-4 minutes

---

## 🧪 Testing

### Step 1: Check Backend Health

```bash
# Replace with your actual backend URL
curl https://YOUR-BACKEND-URL.railway.app/api/v1/health
```

Should return:
```json
{
  "success": true,
  "message": "API is running",
  "environment": "production"
}
```

### Step 2: Check Backend Logs

1. Railway Dashboard → Backend service → **"Deployments"** tab
2. Click latest deployment → **"View Logs"**
3. Look for:

```
🔐 CORS allowed origins: [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://dairy-management-frontend-production.up.railway.app',
  'https://dairy-management-frontend-production.up.railway.app'
]
```

### Step 3: Test Login

1. Go to: `https://dairy-management-frontend-production.up.railway.app`
2. Open browser DevTools (F12) → Console
3. Try to login:
   - Email: `admin@dairysystem.com`
   - Password: `admin123`

**Should work now!** ✅

---

## 🔍 Check Your URLs

### Backend URL Options

Railway might assign URLs like:
- `https://dairy-management-backend-production.up.railway.app`
- `https://dairy-management-api-production.up.railway.app`
- `https://[random-name].railway.app`

### Frontend Currently Pointing To

Check browser DevTools → Network tab:
- What URL is it trying to fetch?
- Is it still `dairy-management-api.onrender.com`?

**If yes:** You need to update `VITE_API_URL` in frontend!

---

## 📋 Quick Action Checklist

- [ ] Find your backend Railway URL
- [ ] Backend → Variables → Add `FRONTEND_URL` (frontend URL)
- [ ] Frontend → Variables → Update `VITE_API_URL` (backend URL)
- [ ] Wait for Railway to redeploy both (~3-4 minutes)
- [ ] Check backend logs for CORS debug info
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Test login from frontend

---

## 🎯 Your Railway Project Structure

```
Your Railway Project
├─ Backend Service
│  ├─ Domain: https://[backend-url].railway.app
│  ├─ FRONTEND_URL = https://dairy-management-frontend-production.up.railway.app
│  └─ VITE_API_URL not needed (backend doesn't use it)
│
├─ Frontend Service  
│  ├─ Domain: https://dairy-management-frontend-production.up.railway.app
│  └─ VITE_API_URL = https://[backend-url].railway.app
│
└─ MySQL Service (optional)
   └─ Variables auto-linked to backend
```

---

## 🆘 Common Issues

### Issue 1: Still pointing to Render

**Symptom:** Browser shows `dairy-management-api.onrender.com` in errors

**Fix:** Update `VITE_API_URL` in frontend service to Railway backend URL

### Issue 2: Wrong backend URL

**Symptom:** `net::ERR_NAME_NOT_RESOLVED`

**Fix:** Double-check backend URL in Railway dashboard → Domains

### Issue 3: CORS still failing

**Symptom:** CORS error after variables added

**Fix:** 
1. Check Railway backend logs for "🔐 CORS allowed origins"
2. Verify frontend URL appears in that list
3. Clear browser cache completely

---

## ✨ Next Steps

1. **Tell me your backend Railway URL** so I can help verify setup
2. **Check both services have correct URLs** in variables
3. **Wait for redeployments** to complete
4. **Test and report** what happens

Your CORS config is correct - just need the right URLs in the right places! 🚀
