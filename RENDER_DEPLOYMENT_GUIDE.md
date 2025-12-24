# Dairy Management System - Render Deployment Guide

This guide will walk you through deploying the Dairy Management System to Render.com.

## 📋 Prerequisites

1. GitHub account with your code repository
2. Render account (free tier available at https://render.com)
3. MySQL database (options below)
4. Email service credentials (Gmail, SendGrid, etc.)

## 🗄️ Database Options

Since Render doesn't offer free MySQL, choose one of these options:

### Option 1: PlanetScale (Recommended - Free Tier Available)
1. Sign up at https://planetscale.com
2. Create a new database: `dairy_management`
3. Get connection details from the dashboard
4. Use MySQL connection string format

### Option 2: Railway (Free Trial)
1. Sign up at https://railway.app
2. Create a new MySQL database
3. Get connection credentials

### Option 3: FreeSQLDatabase.com (Free)
1. Sign up at https://www.freesqldatabase.com
2. Create a MySQL database
3. Note the connection details

### Option 4: Aiven (Free Tier)
1. Sign up at https://aiven.io
2. Create a MySQL service
3. Get connection credentials

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Ensure all files are committed:**
   - `/backend` directory with all API code
   - `/src` directory with frontend code
   - `render.yaml` in root directory
   - `.env.example` files (NOT `.env` - we'll set those in Render)

### Step 2: Deploy Backend to Render

1. **Log in to Render Dashboard:**
   - Go to https://dashboard.render.com

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `dairy-management-system` repo

3. **Configure Backend Service:**
   ```
   Name: dairy-management-api
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Plan: Free
   ```

4. **Set Environment Variables:**
   Click "Environment" tab and add these variables:

   **Database Configuration:**
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_HOST=<your-mysql-host>
   DATABASE_PORT=3306
   DATABASE_NAME=dairy_management
   DATABASE_USER=<your-mysql-username>
   DATABASE_PASSWORD=<your-mysql-password>
   DATABASE_DIALECT=mysql
   ```

   **JWT Configuration:**
   ```
   JWT_SECRET=<generate-a-strong-random-string>
   JWT_EXPIRE=7d
   ```

   **Email Configuration (Gmail example):**
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your-email@gmail.com>
   EMAIL_PASS=<your-app-specific-password>
   FRONTEND_URL=<will-add-after-frontend-deployment>
   ```

   **Cron Jobs Configuration:**
   ```
   CRON_ENABLED=true
   CRON_LOW_STOCK_SCHEDULE=0 9 * * *
   CRON_EXPIRATION_SCHEDULE=0 9 * * *
   CRON_PAYMENT_SCHEDULE=0 10 * * *
   CRON_PRODUCTION_SCHEDULE=0 18 * * *
   CRON_NOTIFICATION_EMAIL=<admin-email@example.com>
   ```

   **API Configuration:**
   ```
   API_VERSION=v1
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://dairy-management-api.onrender.com`

6. **Initialize Database:**
   After deployment, run these commands via Render Shell:
   ```bash
   npm run db:init
   npm run db:seed
   ```

### Step 3: Deploy Frontend to Render (Option A)

1. **Create New Static Site:**
   - Click "New +" → "Static Site"
   - Select same GitHub repository

2. **Configure Frontend Service:**
   ```
   Name: dairy-management-frontend
   Branch: main
   Build Command: npm install && npm run build
   Publish Directory: dist
   Plan: Free
   ```

3. **Set Environment Variables:**
   Create `.env.production` in your local repo:
   ```env
   VITE_API_URL=https://dairy-management-api.onrender.com/api/v1
   ```

4. **Update API calls in frontend:**
   Make sure `src/services/api.ts` uses:
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
   ```

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add production API URL"
   git push origin main
   ```

6. **Deploy:**
   - Click "Create Static Site"
   - Wait for deployment
   - Note your frontend URL: `https://dairy-management-frontend.onrender.com`

### Step 4: Deploy Frontend to Netlify (Option B - Recommended)

Netlify offers better performance for static sites:

1. **Install Netlify CLI (optional):**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your app:**
   ```bash
   npm run build
   ```

3. **Deploy via Netlify Dashboard:**
   - Go to https://app.netlify.com
   - Drag and drop your `dist` folder
   - OR connect your GitHub repository

4. **Configure Environment Variables:**
   ```
   VITE_API_URL=https://dairy-management-api.onrender.com/api/v1
   ```

5. **Set up Redirects:**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Step 5: Update Cross-Origin Settings

1. **Update Backend CORS:**
   Go to Render dashboard → Backend service → Environment
   Update `FRONTEND_URL` to your frontend URL:
   ```
   FRONTEND_URL=https://dairy-management-frontend.onrender.com
   ```

2. **Redeploy backend** to apply CORS changes

### Step 6: Configure Email Service

#### Using Gmail:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate App-Specific Password:
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Scroll to "App passwords"
   - Generate new password for "Mail"
3. Use this password in `EMAIL_PASS` environment variable

#### Using SendGrid (Recommended for Production):
1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create API key
3. Update environment variables:
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=<your-sendgrid-api-key>
   ```

## 🔧 Post-Deployment Configuration

### 1. Test the API
Visit: `https://dairy-management-api.onrender.com/api/v1/health`

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "environment": "production",
  "version": "v1",
  "timestamp": "2024-12-24T10:30:00.000Z"
}
```

### 2. Create Admin User
Use the registration endpoint or run seed script:
```bash
# Via Render Shell
npm run db:seed
```

Default admin credentials:
```
Email: admin@dairy.com
Password: Admin123!
```

**⚠️ Change these immediately after first login!**

### 3. Test Email Notifications
1. Log in to the application
2. Go to Settings
3. Create a test user
4. Try "Forgot Password" feature
5. Check email delivery

### 4. Configure Cron Jobs
Verify cron jobs are running:
- Check Render logs for cron job execution messages
- Test notifications by triggering conditions:
  - Low stock: Set product stock below minimum
  - Expiration: Create batch with near-expiry date
  - Payment: Create overdue invoice

## 🔍 Monitoring & Maintenance

### Check Logs
1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. Monitor for errors

### Common Issues & Solutions

#### Issue: "Database connection failed"
**Solution:** 
- Verify database credentials in environment variables
- Check if database server allows external connections
- Ensure IP whitelist includes Render's IPs

#### Issue: "CORS error"
**Solution:**
- Verify `FRONTEND_URL` is set correctly in backend
- Check that both URLs use HTTPS
- Redeploy backend after changing CORS settings

#### Issue: "Emails not sending"
**Solution:**
- Verify email credentials
- Check email service logs
- Ensure Gmail App Password (not regular password)
- Try SendGrid for better reliability

#### Issue: "Build fails"
**Solution:**
- Check build logs in Render dashboard
- Verify all dependencies in package.json
- Ensure TypeScript compiles locally: `npm run build`

#### Issue: "Free tier service sleeps"
**Solution:**
- Render free tier services sleep after 15 min inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading to paid tier ($7/month) for always-on
- Or use UptimeRobot to ping every 10 minutes

## 💰 Cost Breakdown

### Free Tier Setup:
- **Backend (Render):** Free (sleeps after 15 min)
- **Frontend (Netlify):** Free (100GB bandwidth/month)
- **Database (PlanetScale):** Free (5GB storage, 1B row reads/month)
- **Email (SendGrid):** Free (100 emails/day)
- **Total:** $0/month

### Paid Setup (Recommended for Production):
- **Backend (Render):** $7/month (always-on)
- **Frontend (Netlify Pro):** $19/month (better performance)
- **Database (PlanetScale Scaler):** $29/month (10GB storage)
- **Email (SendGrid Essentials):** $19.95/month (50,000 emails)
- **Total:** ~$75/month

## 🔐 Security Best Practices

1. **Strong Passwords:**
   - Change default admin password immediately
   - Use password manager
   - Enable 2FA where possible

2. **Environment Variables:**
   - Never commit `.env` files
   - Rotate JWT_SECRET periodically
   - Use strong random values

3. **Database:**
   - Regular backups (automated with PlanetScale/Railway)
   - Restrict database access to necessary IPs only
   - Monitor for suspicious queries

4. **API Security:**
   - Rate limiting is enabled (100 requests/15 min)
   - Helmet.js for security headers
   - CORS properly configured

## 🚨 Troubleshooting Commands

### View Backend Logs:
```bash
# In Render dashboard → Logs tab
# Or use Render CLI:
render logs -s dairy-management-api
```

### Restart Services:
```bash
# In Render dashboard → Manual Deploy → Clear build cache & deploy
```

### Database Commands (via Shell):
```bash
# Connect to Render shell
# Then run:
npm run db:init    # Initialize tables
npm run db:seed    # Seed data
npm run db:reset   # Reset everything
```

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [PlanetScale Documentation](https://planetscale.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com)

## 🎉 Success Checklist

- [ ] Backend deployed and health check working
- [ ] Frontend deployed and accessible
- [ ] Database connected and seeded
- [ ] Can log in with admin credentials
- [ ] CORS configured (no browser errors)
- [ ] Email notifications working
- [ ] Cron jobs running (check logs)
- [ ] Changed default admin password
- [ ] All environment variables set
- [ ] Domain configured (optional)

## 📞 Support

If you encounter issues:
1. Check logs in Render dashboard
2. Verify all environment variables
3. Test API endpoints with Postman
4. Check database connection
5. Review this guide step by step

---

**Deployment Date:** December 24, 2025
**Version:** 1.0.0
**Status:** Production Ready ✅
