# Quick Start Guide

Get your Dairy Management System up and running in minutes!

## Prerequisites

- Node.js 14+ installed
- MySQL 5.7+ installed and running
- npm or yarn

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Run the setup script
./setup.sh

# Or manually:
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Configure Database

1. Create MySQL database:
```sql
CREATE DATABASE dairy_management;
```

2. Configure server environment:
```bash
cd server
cp .env.example .env
```

3. Edit `server/.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dairy_management
DB_PORT=3306
JWT_SECRET=your_secret_key_here
```

### 3. Start the Application

**Option A: Run both together (Development)**
```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 5. Login

- **Username:** admin
- **Password:** admin123

⚠️ **Important:** Change the default password after first login!

## What's Next?

1. **Add Cows**: Go to the Cows page and add your first cow
2. **Record Milk Production**: Start tracking daily milk production
3. **Monitor Health**: Add health records for your cows
4. **Track Feed**: Record feed consumption and costs
5. **View Dashboard**: Check statistics and trends

## Troubleshooting

### Database Connection Error
- Verify MySQL is running: `sudo systemctl status mysql`
- Check credentials in `server/.env`
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules
rm -rf server/node_modules
rm -rf client/node_modules
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment options
- Open an issue on the repository

Happy farming! 🐄🥛

