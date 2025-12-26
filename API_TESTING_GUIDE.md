# 🔐 Authentication & Testing Guide

## Default Login Credentials

After running `backend/database/schema.sql`, you can login with:

```
Email:    admin@dairysystem.com
Password: admin123
Role:     Admin (full access)
```

**⚠️ CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!**

---

## 🧪 API Testing

Replace `YOUR_RAILWAY_URL` with your actual Railway backend URL.

### 1. Health Check (No Auth Required)

```bash
curl https://YOUR_RAILWAY_URL/api/v1/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "API is running",
  "environment": "production",
  "version": "v1",
  "timestamp": "2025-12-26T10:30:00.000Z"
}
```

---

### 2. Login (Get JWT Token)

```bash
curl -X POST https://YOUR_RAILWAY_URL/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dairysystem.com",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@dairysystem.com",
    "role": "admin",
    "firstName": "System",
    "lastName": "Administrator"
  }
}
```

**Save the token** - you'll need it for all other requests!

---

### 3. Get Dashboard Stats (Requires Auth)

```bash
curl https://YOUR_RAILWAY_URL/api/v1/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "todayProduction": 0,
    "pendingOrders": 0,
    "criticalStock": 0,
    "monthlyRevenue": 0,
    "productionTrend": 0,
    "ordersTrend": 0,
    "revenueTrend": 0
  }
}
```

---

### 4. Get Products (Requires Auth)

```bash
curl https://YOUR_RAILWAY_URL/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": 1,
      "name": "Fresh Milk",
      "category": "milk",
      "sku": "MILK-001",
      "currentStock": 500,
      "unitPrice": 1500
    },
    ...
  ]
}
```

---

### 5. Get Clients (Requires Auth)

```bash
curl https://YOUR_RAILWAY_URL/api/v1/clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 6. Get Orders (Requires Auth)

```bash
curl https://YOUR_RAILWAY_URL/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔧 Using Postman

### Import Collection

Create a new Postman collection with these requests:

#### 1. Health Check
- **Method:** GET
- **URL:** `{{baseUrl}}/api/v1/health`
- **Auth:** None

#### 2. Login
- **Method:** POST
- **URL:** `{{baseUrl}}/api/v1/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "email": "admin@dairysystem.com",
    "password": "admin123"
  }
  ```

#### 3. Get Dashboard Stats
- **Method:** GET
- **URL:** `{{baseUrl}}/api/v1/dashboard/stats`
- **Auth:** Bearer Token
- **Token:** `{{token}}`

#### 4. Get Products
- **Method:** GET
- **URL:** `{{baseUrl}}/api/v1/products`
- **Auth:** Bearer Token
- **Token:** `{{token}}`

### Postman Environment Variables

```
baseUrl: https://your-app.railway.app
token: [save token from login response]
```

---

## 🌐 Frontend Configuration

Update your frontend `.env` or `.env.production`:

```env
VITE_API_URL=https://your-app.railway.app
```

Then your frontend can connect to the deployed backend!

---

## 🔐 Change Default Password

### Option 1: Via API

```bash
# First, login to get token
TOKEN="your_token_from_login"

# Change password
curl -X PUT https://YOUR_RAILWAY_URL/api/v1/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "admin123",
    "newPassword": "YourNewSecurePassword123!"
  }'
```

### Option 2: Via Frontend

1. Login with `admin@dairysystem.com` / `admin123`
2. Go to **Settings** or **Profile** page
3. Find **Change Password** section
4. Enter current password: `admin123`
5. Enter new secure password
6. Save changes

---

## 👥 Create Additional Users

### Create a New Admin User

```bash
curl -X POST https://YOUR_RAILWAY_URL/api/v1/auth/register \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_admin",
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "role": "admin",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Create a Manager User

```bash
curl -X POST https://YOUR_RAILWAY_URL/api/v1/auth/register \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_manager",
    "email": "jane@example.com",
    "password": "SecurePassword123!",
    "role": "manager",
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

### Create a Staff User

```bash
curl -X POST https://YOUR_RAILWAY_URL/api/v1/auth/register \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bob_staff",
    "email": "bob@example.com",
    "password": "SecurePassword123!",
    "role": "staff",
    "firstName": "Bob",
    "lastName": "Wilson"
  }'
```

---

## 🔑 User Roles & Permissions

### Admin
- Full access to all features
- Can manage users
- Can view all reports
- Can modify system settings

### Manager
- Can manage products, clients, orders
- Can view reports
- Cannot manage users or system settings

### Staff
- Can create orders
- Can view products and clients
- Limited access to reports
- Cannot modify products or settings

---

## 🧪 Sample Test Data

Your `schema.sql` includes sample products:

1. **Fresh Milk** - 500L in stock
2. **Whole Milk** - 300L in stock
3. **Plain Yogurt** - 200 pieces
4. **Strawberry Yogurt** - 150 pieces
5. **Cheddar Cheese** - 50kg
6. **Fresh Butter** - 100 pieces

You can test the API with these products immediately!

---

## 📱 Full API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register (admin only)
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password
- `PUT /api/v1/auth/change-password` - Change password
- `GET /api/v1/auth/me` - Get current user

### Dashboard
- `GET /api/v1/dashboard/stats` - Get statistics
- `GET /api/v1/dashboard/recent-activities` - Recent activities

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Clients
- `GET /api/v1/clients` - Get all clients
- `GET /api/v1/clients/:id` - Get single client
- `POST /api/v1/clients` - Create client
- `PUT /api/v1/clients/:id` - Update client
- `DELETE /api/v1/clients/:id` - Delete client

### Orders
- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/orders/:id` - Get single order
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/:id` - Update order
- `DELETE /api/v1/orders/:id` - Delete order

### Production Batches
- `GET /api/v1/batches` - Get all batches
- `GET /api/v1/batches/:id` - Get single batch
- `POST /api/v1/batches` - Create batch
- `PUT /api/v1/batches/:id` - Update batch
- `DELETE /api/v1/batches/:id` - Delete batch

### Invoices
- `GET /api/v1/invoices` - Get all invoices
- `GET /api/v1/invoices/:id` - Get single invoice
- `POST /api/v1/invoices` - Create invoice
- `PUT /api/v1/invoices/:id` - Update invoice
- `DELETE /api/v1/invoices/:id` - Delete invoice

---

## 🎉 Your App is Live!

**Backend URL:** Your Railway backend URL  
**Login Email:** `admin@dairysystem.com`  
**Login Password:** `admin123`

**Remember to:**
1. ✅ Change the default password
2. ✅ Create additional users as needed
3. ✅ Update frontend with backend URL
4. ✅ Test all functionality
5. ✅ Configure email service (optional)
6. ✅ Enable CRON jobs if needed (optional)

Happy managing! 🥛🧀🧈
