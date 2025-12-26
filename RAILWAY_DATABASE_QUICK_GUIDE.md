# Railway Database Setup - Quick Steps

## Visual Guide 🎯

### 1️⃣ Add MySQL to Railway

```
Railway Dashboard
    │
    ├─ Click "+ New"
    │
    ├─ Select "Database"
    │
    └─ Choose "Add MySQL"
         │
         └─ Railway creates MySQL service automatically
```

### 2️⃣ Link to Your Backend

```
Railway Backend Service
    │
    ├─ Go to "Variables" tab
    │
    └─ Add these references:

        DB_HOST        = ${{MySQL.MYSQLHOST}}
        DB_PORT        = ${{MySQL.MYSQLPORT}}
        DB_USERNAME    = ${{MySQL.MYSQLUSER}}
        DB_PASSWORD    = ${{MySQL.MYSQLPASSWORD}}
        DB_DATABASE    = ${{MySQL.MYSQLDATABASE}}
```

### 3️⃣ Initialize Database Schema

**Option A: Railway MySQL Query Tab** (Easiest)

```
Railway MySQL Service
    │
    ├─ Click "Query" tab
    │
    ├─ Copy content from: backend/database/schema.sql
    │
    └─ Click "Execute"
```

**Option B: MySQL Client**

```bash
# Get credentials from Railway MySQL service variables
mysql -h MYSQLHOST -P MYSQLPORT -u MYSQLUSER -p

# Enter password when prompted
# Then run:
source backend/database/schema.sql
```

### 4️⃣ Verify Connection

```
Railway Backend Logs should show:
    │
    ├─ ✅ Server running on port 5000
    │
    └─ ✅ Database connected successfully
```

## Environment Variables Mapping

Railway MySQL service provides these variables:

| Railway Variable | Your Backend Expects | Mapping |
|-----------------|---------------------|---------|
| MYSQLHOST | DB_HOST | `${{MySQL.MYSQLHOST}}` |
| MYSQLPORT | DB_PORT | `${{MySQL.MYSQLPORT}}` |
| MYSQLUSER | DB_USERNAME | `${{MySQL.MYSQLUSER}}` |
| MYSQLPASSWORD | DB_PASSWORD | `${{MySQL.MYSQLPASSWORD}}` |
| MYSQLDATABASE | DB_DATABASE | `${{MySQL.MYSQLDATABASE}}` |

## Complete Railway Backend Variables

```env
# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=https://your-frontend-url.com

# Database (mapped from MySQL service)
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Email (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Optional: CRON (for automated tasks)
CRON_ENABLED=false
```

## What Happens After Setup?

### 1. Server Starts ✅
```
╔════════════════════════════════════════╗
║   🥛 Dairy Management System API      ║
║   Server running on port 5000          ║
║   Environment: production              ║
╚════════════════════════════════════════╝
```

### 2. Database Connects ✅
```
✅ Database connected successfully
```

### 3. Health Check Passes ✅
```
GET /api/v1/health
Response: {"success": true, "message": "API is running"}
```

### 4. API Ready ✅
```
Your backend is ready to:
  ├─ Accept user logins
  ├─ Manage products
  ├─ Process orders
  ├─ Track inventory
  └─ Generate invoices
```

## Default Login (After Schema Setup)

```
Email:    admin@dairysystem.com
Password: admin123
```

**⚠️ CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!**

## Testing Your Database

### Test 1: Health Check
```bash
curl https://your-backend.railway.app/api/v1/health
```

### Test 2: Login (Get Token)
```bash
curl -X POST https://your-backend.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dairysystem.com","password":"admin123"}'
```

### Test 3: Get Dashboard Stats
```bash
curl https://your-backend.railway.app/api/v1/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 4: Get Products
```bash
curl https://your-backend.railway.app/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Schema Includes

✅ **Users** - Admin, managers, staff with roles
✅ **Products** - Milk, yogurt, cheese, butter inventory
✅ **Clients** - Customer management with credit limits
✅ **Orders** - Order processing with line items
✅ **Batches** - Production tracking with expiry dates
✅ **Invoices** - Invoicing with payment tracking
✅ **Payments** - Payment records and history
✅ **Stock Movements** - Inventory tracking

## Need Help?

### If database won't connect:
1. Check Railway MySQL service is running
2. Verify variable mappings: `${{MySQL.MYSQLHOST}}` format
3. Check backend logs for specific error messages
4. Ensure schema.sql has been executed

### If tables don't exist:
1. Run schema.sql in Railway MySQL Query tab
2. Or connect with MySQL client and run the script
3. Check Railway MySQL service logs

### If login fails:
1. Make sure schema.sql created the default admin user
2. Use exact credentials: `admin@dairysystem.com` / `admin123`
3. Check backend logs for authentication errors

## Summary

```
Railway Setup:
  1. Add MySQL service          (1 minute)
  2. Map variables              (2 minutes)
  3. Run schema.sql             (30 seconds)
  4. Backend auto-redeploys     (1-2 minutes)
  5. Test health check          (10 seconds)
  6. Login and test             (1 minute)
  
  Total: ~5 minutes
```

🎉 **Your database is ready for production!**

For detailed information, see: `DATABASE_SETUP.md`
