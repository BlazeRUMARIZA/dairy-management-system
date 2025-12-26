# 🎯 Quick Setup Guide - Three Options

Choose the easiest option for you:

---

## ⚡ OPTION 1: Railway Manual (Fastest - 2 minutes)

**Best if you want to deploy RIGHT NOW with minimal setup.**

### Steps:

1. **Go to Railway Dashboard:**
   - https://railway.app/dashboard
   - Click your project → **MySQL** service

2. **Click "Query" tab at the top**

3. **Copy this entire SQL and paste it:**
   👉 See file: `database/schema.sql`
   
4. **Click "Run Query"**

5. **Test login:**
   - Go to your frontend: https://dairy-management-frontend-production.up.railway.app
   - Email: `admin@dairysystem.com`
   - Password: `admin123`

✅ **Done! Takes 2 minutes.**

---

## 🐳 OPTION 2: Docker Compose (Local Development)

**Best for local development - everything automatic.**

### Steps:

```bash
# 1. Go to backend directory
cd backend

# 2. Copy environment file
cp .env.docker .env

# 3. Start everything (automatic database setup!)
docker compose up -d

# 4. Test
curl http://localhost:5000/health
```

**What you get:**
- ✅ MySQL running on port 3306
- ✅ Backend API on port 5000  
- ✅ All tables automatically created
- ✅ Admin user ready to use
- ✅ Sample products loaded

### Useful Commands:
```bash
# View logs
docker compose logs -f

# Stop
docker compose down

# Fresh start
docker compose down -v && docker compose up -d
```

---

## 🚂 OPTION 3: Railway with Docker (Advanced)

**Best if you want automatic database setup on Railway deployments.**

This is more complex - requires:
1. Railway to support Docker builds
2. MySQL client in container
3. Proper entrypoint script

**For now, use Option 1 (manual) - it's faster and works perfectly!**

---

## 🏆 Recommendation

### Right Now:
**Use Option 1** - Go to Railway MySQL Query tab, paste `database/schema.sql`, click Run.

### Local Development:
**Use Option 2** - Docker Compose handles everything automatically.

### Production:
**Use Option 1** - You only need to run the SQL **once**. After that, the database persists forever.

---

## 📋 Quick Reference

### Default Login:
- Email: `admin@dairysystem.com`  
- Password: `admin123`

### API Endpoints:
- Health: `https://your-backend.up.railway.app/health`
- Login: `https://your-backend.up.railway.app/api/v1/auth/login`

### Database:
- 9 tables: users, products, clients, orders, order_items, batches, invoices, payments, stock_movements
- Created by: `database/schema.sql`

---

## 🎉 That's It!

Pick Option 1 for quickest results. Option 2 for local development.

**No complicated Docker setup needed for Railway - just run the SQL once!** ⚡
