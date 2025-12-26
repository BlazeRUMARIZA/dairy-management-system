# Database Setup Guide

## Railway MySQL Database

### Step 1: Add MySQL Service to Railway

1. Go to your Railway project dashboard
2. Click **"+ New"** → **"Database"** → **"Add MySQL"**
3. Railway creates a MySQL instance with auto-generated credentials

### Step 2: Link Database to Backend

In your backend service, add these environment variables:

```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
```

Railway automatically injects the MySQL service variables.

### Step 3: Initialize Database Schema

You have two options:

#### Option A: Auto-Sync (Development Only)

In your backend `.env`, temporarily set:

```env
DB_SYNC=true
DB_ALTER=true
```

This will auto-create tables when the server starts. **Remove after first run!**

#### Option B: Manual SQL Script (Recommended for Production)

1. **Connect to Railway MySQL:**

   Get credentials from Railway dashboard (MySQL service → Variables):
   
   ```bash
   mysql -h MYSQLHOST -P MYSQLPORT -u MYSQLUSER -p
   # Enter MYSQLPASSWORD when prompted
   ```

2. **Create Database:**

   ```sql
   CREATE DATABASE IF NOT EXISTS dairy_db;
   USE dairy_db;
   ```

3. **Run Schema Creation:**

   Use the provided SQL script:
   
   ```bash
   # From your local machine
   mysql -h MYSQLHOST -P MYSQLPORT -u MYSQLUSER -p MYSQLDATABASE < backend/database/schema.sql
   ```
   
   Or copy/paste the SQL from `backend/database/schema.sql` into Railway's MySQL Query tab.

### Step 4: Verify Database Connection

After setup, your server logs should show:

```
✅ Database connected successfully
```

If you see:
```
❌ Database connection failed: Connection timed out
```

Check your Railway MySQL variables are correctly mapped to `DB_*` variables.

## Alternative: External Database

If you prefer using an external database (AWS RDS, DigitalOcean, etc.):

### Step 1: Create MySQL Database

Create a MySQL 8.0+ database on your preferred provider.

### Step 2: Set Railway Environment Variables

```env
DB_HOST=your-external-mysql-host.com
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=dairy_db
```

### Step 3: Allow Railway IP

Most external databases require whitelisting IPs:
- Railway uses dynamic IPs, so you might need to allow all IPs (0.0.0.0/0)
- Or use Railway's static IP feature (requires Pro plan)

### Step 4: Run Schema

Connect to your external MySQL and run `backend/database/schema.sql`

## Database Configuration Options

Your `backend/src/config/database.ts` supports these environment variables:

```env
# Connection
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=dairy_db

# Sequelize Options
DB_DIALECT=mysql
DB_POOL_MAX=5
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000

# Auto-sync (DANGER: Only for development!)
DB_SYNC=false
DB_ALTER=false
DB_FORCE=false
```

### ⚠️ IMPORTANT: Never enable DB_SYNC in production!

- `DB_SYNC=true` will auto-create tables (removes all data!)
- `DB_ALTER=true` will modify tables to match models
- `DB_FORCE=true` will drop and recreate all tables

These are ONLY for local development. Use SQL migrations in production.

## Default Login Credentials

After running the schema, you can login with:

- **Email:** `admin@dairysystem.com`
- **Password:** `admin123`

**⚠️ CHANGE THIS PASSWORD IMMEDIATELY!**

## Troubleshooting

### "Database connection failed"

1. **Check variables** - Ensure DB_HOST, DB_PORT, etc. are correct
2. **Check Railway MySQL status** - Is the MySQL service running?
3. **Test connection** - Use Railway's MySQL Query tab to test
4. **Check logs** - Look for specific error messages

### "Table doesn't exist"

You need to run the schema.sql script to create tables.

### "Access denied"

- Verify DB_USERNAME and DB_PASSWORD are correct
- Check Railway MySQL variables are mapped correctly

### "Too many connections"

Increase `DB_POOL_MAX` or reduce concurrent requests.

## Database Backup

### Manual Backup (Railway CLI)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Export database
railway run mysqldump -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE > backup.sql
```

### Automated Backup

Consider setting up automated backups:
- Railway Pro plan includes automated backups
- Or use external backup services
- Or create a cron job to dump and upload to S3

## Next Steps

1. ✅ Add MySQL service to Railway
2. ✅ Map DB variables to your backend
3. ✅ Run schema.sql to create tables
4. ✅ Deploy backend (it will auto-connect)
5. ✅ Login with default credentials
6. ✅ Change admin password
7. ✅ Test creating products, clients, orders

Your database is now ready for production! 🎉

