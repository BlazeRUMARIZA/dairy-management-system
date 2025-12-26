# Railway Deployment Guide

## ✅ What We Fixed

The health check was failing because the server initialization order was blocking startup. We fixed this by:

1. **Server starts FIRST** - `app.listen()` happens before database connection
2. **Health checks respond immediately** - `/health` and `/api/v1/health` endpoints are registered before DB connection
3. **Non-blocking DB connection** - Database connects asynchronously after server is running
4. **Graceful error handling** - Server continues running even if DB fails
5. **CRON jobs are optional** - Controlled by `CRON_ENABLED` environment variable

## 🔧 Railway Environment Variables

Make sure these are set in your Railway project:

### Required Variables

```env
# Database (Railway will provide these from MySQL service)
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your-password
DB_DATABASE=dairy_db

# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL (your deployed frontend URL)
FRONTEND_URL=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Optional Email Variables (if you want notifications)

```env
# Email Service (Gmail or SendGrid)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
# OR for SendGrid:
# EMAIL_SERVICE=sendgrid
# SENDGRID_API_KEY=your-sendgrid-api-key

EMAIL_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### Optional CRON Variables (if you want automated notifications)

```env
# Enable/Disable CRON jobs
CRON_ENABLED=false  # Set to 'true' to enable

# CRON schedules (only needed if CRON_ENABLED=true)
CRON_LOW_STOCK_SCHEDULE=0 9 * * *
CRON_EXPIRATION_SCHEDULE=0 9 * * *
CRON_PAYMENT_REMINDER_SCHEDULE=0 10 * * *
CRON_PRODUCTION_REPORT_SCHEDULE=0 18 * * *
CRON_NOTIFICATION_EMAIL=admin@yourdomain.com
```

## 📋 Deployment Steps

### Step 1: Link MySQL Database

1. In Railway dashboard, add a **MySQL** service
2. Railway will automatically create these variables:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

3. **Map them to your app's expected names**:
   ```
   DB_HOST = ${{MySQL.MYSQLHOST}}
   DB_PORT = ${{MySQL.MYSQLPORT}}
   DB_USERNAME = ${{MySQL.MYSQLUSER}}
   DB_PASSWORD = ${{MySQL.MYSQLPASSWORD}}
   DB_DATABASE = ${{MySQL.MYSQLDATABASE}}
   ```

### Step 2: Configure Health Checks

Railway should automatically detect the health check, but if needed:

- **Health Check Path**: `/api/v1/health`
- **Health Check Interval**: 30 seconds
- **Health Check Timeout**: 10 seconds
- **Start Command**: `npm start`

### Step 3: Set Environment Variables

Add all required variables from the list above in Railway's Variables section.

### Step 4: Deploy

1. Push your code to GitHub
2. Railway will auto-deploy
3. Check the logs for:
   ```
   ╔════════════════════════════════════════╗
   ║   🥛 Dairy Management System API      ║
   ║   Server running on port 5000          ║
   ║   Environment: production              ║
   ╚════════════════════════════════════════╝
   ```

## 🔍 Troubleshooting

### Health Check Still Failing?

1. **Check the logs** - Railway > Logs > See what errors appear
2. **Verify PORT** - Railway sets `PORT` automatically, our code uses `process.env.PORT || 5000`
3. **Test health endpoint** - Once deployed, visit `https://your-domain.railway.app/api/v1/health`

### Database Connection Issues?

1. **Check DB variables** - Make sure DB_HOST, DB_PORT, etc. are correct
2. **Server will still run** - Even if DB fails, server continues running
3. **Check logs** - Look for "Database connection failed" message

### Email Service Issues?

1. **Emails are optional** - Server runs fine without email configuration
2. **Gmail**: Use [App Passwords](https://support.google.com/accounts/answer/185833)
3. **SendGrid**: Get free API key from [SendGrid](https://sendgrid.com/)

### CRON Jobs Not Running?

1. **Check CRON_ENABLED** - Must be set to `'true'` (string, not boolean)
2. **Logs will show** - "✅ Cron jobs started" or "⏸️ Cron jobs disabled"
3. **Disable if not needed** - Set `CRON_ENABLED=false` or leave it unset

## ✨ What Happens on Startup

1. ✅ **Server starts** and listens on PORT (5000 or Railway's PORT)
2. ✅ **Health checks respond** immediately at `/health` and `/api/v1/health`
3. ⏳ **Database connects** asynchronously in the background
   - If successful: "✅ Database connected successfully"
   - If failed: "❌ Database connection failed" (server continues running)
4. ⏳ **Email service tests** connection (non-blocking)
   - If failed: "⚠️ Email service unavailable"
5. ⏳ **CRON jobs start** (if CRON_ENABLED=true)
   - If disabled: "⏸️ Cron jobs disabled"

## 🎯 Expected Behavior

### Healthy Deployment

```bash
GET https://your-app.railway.app/api/v1/health

Response 200 OK:
{
  "success": true,
  "message": "API is running",
  "environment": "production",
  "version": "v1",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### With Database Connected

```bash
GET https://your-app.railway.app/api/v1/dashboard/stats

Response 200 OK:
{
  "success": true,
  "data": {
    "todayProduction": 1500,
    "pendingOrders": 23,
    "criticalStock": 5,
    "monthlyRevenue": 45000,
    ...
  }
}
```

## 📞 Next Steps

1. **Frontend**: Update `VITE_API_URL` to point to your Railway backend URL
2. **Test**: Try logging in, creating orders, checking dashboard
3. **Email (Optional)**: Configure email service if you want notifications
4. **CRON (Optional)**: Enable automated notifications if needed

## 🚀 Your Server is Now Resilient

The server will:
- ✅ Start even if database is down
- ✅ Respond to health checks immediately
- ✅ Handle database connection failures gracefully
- ✅ Continue running if email service fails
- ✅ Work without CRON jobs if disabled

Perfect for Railway's health check requirements!
