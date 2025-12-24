# Testing Guide - API Integration

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd /home/rumariza/dairy-management-system/backend
npm run dev
```

Expected output:
```
✅ MySQL Connected: localhost:3306
✅ Database models synchronized
Server running on port 5000
```

### 2. Start Frontend Server
```bash
cd /home/rumariza/dairy-management-system
npm run dev
```

Expected output:
```
VITE v4.5.0 ready
➜  Local:   http://localhost:3000/
```

## 🔧 Recent Fixes Applied

### CORS Configuration ✅
**File:** `backend/src/server.ts`

**Changes:**
- Updated CORS to allow multiple origins: `localhost:3000` and `localhost:5173`
- Added proper CORS headers: `GET, POST, PUT, DELETE, PATCH, OPTIONS`
- Enabled credentials and Authorization headers

### Model Initialization ✅
**File:** `backend/src/config/database.ts`

**Changes:**
- Explicitly added all models to Sequelize instance using `sequelize.addModels()`
- Fixed imports: User (named export), others (default exports)
- Removed automatic model loading from path

**Models Added:**
- User
- Product
- Client
- Order
- Batch
- Invoice

## 🧪 Testing Checklist

### Backend Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "environment": "development",
  "timestamp": "2025-12-22T..."
}
```

### Test Login Endpoint
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@dairy.com", "password": "admin123"}'
```

Expected response (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@dairy.com",
    "role": "admin"
  }
}
```

### Test Dashboard Stats
```bash
# First get token from login, then:
curl http://localhost:5000/api/v1/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🌐 Frontend Testing

### 1. Login Page
**URL:** http://localhost:3000/

**Test Credentials:**
- Email: `admin@dairy.com`
- Password: `admin123`

**Expected Behavior:**
- Form loads without errors
- Login button shows loading state when clicked
- On success: Redirects to dashboard
- On error: Shows error message below form

### 2. Dashboard
**URL:** http://localhost:3000/dashboard (after login)

**Expected Behavior:**
- Shows loading spinner initially
- Displays 4 stat cards with real data:
  - Today's Production (liters)
  - Pending Orders (count)
  - Critical Stock Alerts (count)
  - Monthly Revenue (€)
- Charts display (still using mock data for now)

### 3. Inventory/Products Page
**URL:** http://localhost:3000/inventory

**Expected Behavior:**
- Shows loading spinner initially
- Displays product list from database
- "Add Product" button works
- Edit/Delete buttons functional
- Stock update buttons work
- Low stock alerts display

### 4. Clients Page
**URL:** http://localhost:3000/clients

**Expected Behavior:**
- Shows loading spinner initially
- Displays client list from database
- "Add Client" button works
- Edit/Delete buttons functional
- Client details modal works

## ⚠️ Common Issues & Solutions

### Issue 1: CORS Error
**Error:** `CORS header 'Access-Control-Allow-Origin' does not match`

**Solution:**
- Ensure backend `FRONTEND_URL` in `.env` matches your frontend URL
- Backend now allows both `localhost:3000` and `localhost:5173`
- Restart backend after .env changes

### Issue 2: Model Not Initialized
**Error:** `Model not initialized: Member "findOne" cannot be called`

**Solution:** ✅ FIXED
- Models are now explicitly added to Sequelize instance
- Restart backend to apply changes

### Issue 3: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Kill process on port 5000
fuser -k 5000/tcp

# Or find and kill manually
lsof -ti:5000 | xargs kill -9
```

### Issue 4: Database Connection Failed
**Error:** `Error connecting to MySQL`

**Solutions:**
1. Ensure XAMPP MySQL is running
2. Check database credentials in `backend/.env`
3. Verify database exists:
   ```bash
   mysql -u root -p
   SHOW DATABASES;
   ```

### Issue 5: No Data in Database
**Solution:** Run database seed script:
```bash
cd backend
npm run seed
```

## 📊 Integration Status

### ✅ Completed (3/9 components - 33%)
1. **AuthContext** - Real API authentication with token management
2. **Login Page** - Error handling, loading states
3. **Dashboard** - Real statistics from API
4. **Inventory/Products** - Complete CRUD with API
5. **Clients** - Complete CRUD with API

### ⏳ Remaining (4/9 components - 67%)
6. **Orders** - Needs API migration
7. **Production/Batches** - Needs API migration
8. **Invoicing** - Needs API migration
9. **Reports** - Needs API migration

## 🔍 Debugging Tips

### View Backend Logs
Backend logs show all SQL queries in development mode:
```bash
cd backend
npm run dev
# Watch the console for SQL queries
```

### Browser Console
Open browser DevTools (F12):
- **Console tab:** View API errors and responses
- **Network tab:** Inspect API calls, status codes, response data
- Look for XHR/Fetch requests to `localhost:5000`

### Check API Response
In browser console after login:
```javascript
// Check if token is stored
localStorage.getItem('token')

// Check user data
localStorage.getItem('user')
```

### Test API Directly
Use browser DevTools Console:
```javascript
// Test login
fetch('http://localhost:5000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@dairy.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(console.log)
```

## 📝 Next Steps

1. **Test Current Integration:**
   - Login with test credentials
   - Verify dashboard shows real data
   - Test product CRUD operations
   - Test client CRUD operations

2. **Continue Migration:**
   - Orders page (priority)
   - Production/Batches page
   - Invoicing page
   - Reports page

3. **Data Validation:**
   - Ensure all forms validate properly
   - Test error scenarios (network errors, validation errors)
   - Verify loading states everywhere

4. **Performance Testing:**
   - Check page load times
   - Monitor API response times
   - Optimize queries if needed

## 🎯 Success Criteria

- ✅ Backend starts without errors
- ✅ Frontend starts without errors
- ✅ Login works with real credentials
- ✅ Dashboard displays real data
- ✅ Products CRUD operations work
- ✅ Clients CRUD operations work
- ⏳ All pages use API (not localStorage)
- ⏳ No console errors
- ⏳ All features functional

## 📞 Support

If you encounter issues:
1. Check this guide's "Common Issues" section
2. Review browser console for errors
3. Check backend logs for server errors
4. Verify database connection and data
