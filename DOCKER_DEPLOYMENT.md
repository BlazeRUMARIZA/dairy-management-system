# 🐳 Docker Deployment Guide - Dairy Management System

Complete guide to deploy the Dairy Management System using Docker and Docker Compose with **automatic database initialization**.

---

## 📋 Prerequisites

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher

### Install Docker (if not installed)

**Ubuntu/Debian:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**Windows/Mac:**
- Download Docker Desktop: https://www.docker.com/products/docker-desktop

**Verify Installation:**
```bash
docker --version
docker compose version
```

---

## 🚀 Quick Start (3 Commands!)

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Copy Environment File
```bash
cp .env.docker .env
```

### 3. Start Everything
```bash
docker compose up -d
```

**That's it!** 🎉 The system will:
- ✅ Create MySQL container
- ✅ Automatically run `schema.sql` to create all tables
- ✅ Create default admin user
- ✅ Start backend API
- ✅ Connect everything together

---

## 📦 What Gets Created

### Containers:
1. **dairy-mysql** - MySQL 8.0 database (port 3306)
2. **dairy-backend** - Node.js API server (port 5000)

### Volumes:
- **mysql_data** - Persistent database storage

### Network:
- **dairy-network** - Private network for containers

---

## 🔧 Configuration

### Environment Variables (.env)

Edit `backend/.env` to customize:

```env
# Database credentials
DB_NAME=dairy_management
DB_USER=dairy_user
DB_PASSWORD=dairy123

# Backend port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# JWT Secrets - CHANGE THESE!
JWT_SECRET=your-unique-secret-key-here
JWT_REFRESH_SECRET=your-unique-refresh-key-here

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@dairysystem.com
```

---

## 📚 Common Commands

### Start Services
```bash
docker compose up -d
```

### Stop Services
```bash
docker compose down
```

### Stop and Remove Everything (including database)
```bash
docker compose down -v
```

### View Logs
```bash
# All logs
docker compose logs -f

# Backend only
docker compose logs -f backend

# MySQL only
docker compose logs -f mysql

# Last 100 lines
docker compose logs --tail=100 -f
```

### Restart Services
```bash
docker compose restart
```

### Check Status
```bash
docker compose ps
```

### Rebuild After Code Changes
```bash
docker compose up -d --build
```

---

## 🔍 Verify Deployment

### 1. Check Containers are Running
```bash
docker compose ps
```

Should show:
```
NAME              STATUS          PORTS
dairy-backend     Up (healthy)    0.0.0.0:5000->5000/tcp
dairy-mysql       Up (healthy)    0.0.0.0:3306->3306/tcp
```

### 2. Test API Health
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-26T..."
}
```

### 3. Test Database Connection
```bash
curl http://localhost:5000/api/v1/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-12-26T..."
}
```

### 4. Check Database Tables
```bash
docker exec -it dairy-mysql mysql -udairy_user -pdairy123 dairy_management -e "SHOW TABLES;"
```

Should show 9 tables:
```
+---------------------------+
| Tables_in_dairy_management|
+---------------------------+
| batches                   |
| clients                   |
| invoices                  |
| order_items               |
| orders                    |
| payments                  |
| products                  |
| stock_movements           |
| users                     |
+---------------------------+
```

### 5. Verify Admin User
```bash
docker exec -it dairy-mysql mysql -udairy_user -pdairy123 dairy_management -e "SELECT id, username, email, role FROM users WHERE role='admin';"
```

Should show:
```
+----+----------+-------------------------+-------+
| id | username | email                   | role  |
+----+----------+-------------------------+-------+
|  1 | admin    | admin@dairysystem.com   | admin |
+----+----------+-------------------------+-------+
```

---

## 🧪 Test Login

### Using curl:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dairysystem.com",
    "password": "admin123"
  }'
```

Should return JWT token:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@dairysystem.com",
    "role": "admin"
  }
}
```

### Using Frontend:
1. Start frontend: `npm run dev` in main directory
2. Open: http://localhost:5173
3. Login with:
   - **Email**: `admin@dairysystem.com`
   - **Password**: `admin123`

---

## 🗄️ Database Management

### Connect to MySQL
```bash
docker exec -it dairy-mysql mysql -udairy_user -pdairy123 dairy_management
```

### Backup Database
```bash
docker exec dairy-mysql mysqldump -udairy_user -pdairy123 dairy_management > backup.sql
```

### Restore Database
```bash
docker exec -i dairy-mysql mysql -udairy_user -pdairy123 dairy_management < backup.sql
```

### Reset Database (Fresh Start)
```bash
# Stop and remove containers + volumes
docker compose down -v

# Start again (will run schema.sql automatically)
docker compose up -d
```

---

## 🐛 Troubleshooting

### Issue: Containers won't start
```bash
# Check logs
docker compose logs

# Check specific service
docker compose logs backend
docker compose logs mysql
```

### Issue: Port already in use
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>

# Or change port in .env
PORT=5001
```

### Issue: Database connection failed
```bash
# Check MySQL is healthy
docker compose ps mysql

# Wait for MySQL to be ready (takes ~30 seconds)
docker compose logs -f mysql

# Look for: "ready for connections"
```

### Issue: Schema not created
```bash
# Manually run schema
docker exec -i dairy-mysql mysql -udairy_user -pdairy123 dairy_management < database/schema.sql

# Or rebuild everything
docker compose down -v
docker compose up -d
```

### Issue: Permission denied on uploads
```bash
# Fix permissions
mkdir -p uploads
chmod 777 uploads
```

---

## 🔄 Update After Code Changes

### Backend code changed:
```bash
# Rebuild and restart
docker compose up -d --build backend
```

### Database schema changed:
```bash
# Stop everything
docker compose down -v

# Start fresh (runs new schema)
docker compose up -d
```

### Environment variables changed:
```bash
# Just restart
docker compose restart
```

---

## 🚀 Production Deployment

### 1. Update Environment Variables
```env
NODE_ENV=production
DB_PASSWORD=strong-password-here
JWT_SECRET=long-random-string-here
JWT_REFRESH_SECRET=another-long-random-string
FRONTEND_URL=https://yourdomain.com
```

### 2. Enable SSL (Optional - with Nginx)
```bash
# Add nginx service to docker-compose.yml
# Use Let's Encrypt for SSL certificates
```

### 3. Set Up Monitoring
```bash
# Add health check monitoring
# Use Docker health checks
docker compose ps
```

### 4. Regular Backups
```bash
# Add to crontab
0 2 * * * docker exec dairy-mysql mysqldump -udairy_user -pdairy123 dairy_management > /backups/dairy_$(date +\%Y\%m\%d).sql
```

---

## 📊 Resource Usage

**Typical Usage:**
- MySQL: ~400MB RAM
- Backend: ~150MB RAM
- Total: ~550MB RAM, 2GB disk

**Minimum Requirements:**
- 1GB RAM
- 5GB disk space
- 1 CPU core

**Recommended:**
- 2GB RAM
- 10GB disk space
- 2 CPU cores

---

## 🆘 Support

### View All Logs
```bash
docker compose logs -f
```

### Access Container Shell
```bash
# Backend
docker exec -it dairy-backend sh

# MySQL
docker exec -it dairy-mysql bash
```

### Check Container Resources
```bash
docker stats
```

---

## ✅ Success Checklist

- [ ] Docker and Docker Compose installed
- [ ] `.env` file created and customized
- [ ] `docker compose up -d` ran successfully
- [ ] Both containers show "healthy" status
- [ ] API health check returns 200 OK
- [ ] Database has 9 tables
- [ ] Admin user exists
- [ ] Login test successful
- [ ] Frontend can connect to backend

---

## 🎉 You're Done!

Your Dairy Management System is now running with:
- ✅ Automatic database initialization
- ✅ Default admin user created
- ✅ Sample products loaded
- ✅ Health monitoring enabled
- ✅ Persistent data storage
- ✅ Easy backup/restore

**Default Credentials:**
- Email: `admin@dairysystem.com`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the admin password immediately!

---

## 📞 Need Help?

Check logs: `docker compose logs -f`
Check status: `docker compose ps`
Restart: `docker compose restart`
Fresh start: `docker compose down -v && docker compose up -d`
