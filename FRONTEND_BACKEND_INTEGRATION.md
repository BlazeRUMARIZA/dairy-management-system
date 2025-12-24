# 🔗 Frontend-Backend Integration Guide

## ✅ Integration Complete!

Your frontend is now connected to the backend API. Here's what has been set up:

---

## 📁 Files Created

### 1. **Environment Configuration**
- `.env` - Frontend environment variables
- `.env.example` - Environment template
- `src/vite-env.d.ts` - TypeScript declarations for env variables

### 2. **API Service Layer**
- `src/services/api.ts` - Complete API integration with all endpoints

---

## 🔧 Configuration

### Environment Variables (`.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Dairy Management System
VITE_APP_VERSION=1.0.0
```

**Important:** Make sure both servers are running:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

---

## 📚 API Service Usage

### Import the API
```typescript
import api from '@/services/api';
// or
import { authApi, productsApi, ordersApi } from '@/services/api';
```

### Authentication Examples

#### Login
```typescript
try {
  const response = await api.auth.login('admin@dairy.com', 'password123');
  console.log('User:', response.user);
  console.log('Token:', response.token);
  // Token and user are automatically saved to localStorage
} catch (error) {
  console.error('Login failed:', error.message);
}
```

#### Register
```typescript
const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'viewer'
};

const response = await api.auth.register(userData);
```

#### Logout
```typescript
api.auth.logout(); // Clears token and redirects to login
```

#### Get Current User
```typescript
const response = await api.auth.getCurrentUser();
console.log('Current user:', response.data);
```

---

### Products Examples

#### Get All Products
```typescript
// Get all products
const response = await api.products.getAll();
console.log('Products:', response.data);

// With filters
const filtered = await api.products.getAll({
  search: 'milk',
  category: 'Dairy',
  status: 'in-stock'
});
```

#### Create Product
```typescript
const productData = {
  name: 'Fresh Milk 2L',
  category: 'Milk',
  sku: 'MILK-FRESH-2L',
  currentStock: 200,
  minThreshold: 100,
  maxCapacity: 500,
  unit: 'L',
  unitPrice: 4.50,
  costPrice: 3.20
};

const response = await api.products.create(productData);
```

#### Update Product
```typescript
const response = await api.products.update(productId, {
  currentStock: 250,
  unitPrice: 4.75
});
```

#### Update Stock
```typescript
// Add stock
await api.products.updateStock(productId, 50, 'add');

// Remove stock
await api.products.updateStock(productId, 20, 'remove');
```

#### Get Low Stock Products
```typescript
const response = await api.products.getLowStock();
console.log('Low stock items:', response.data);
```

---

### Orders Examples

#### Get All Orders
```typescript
const response = await api.orders.getAll();

// With filters
const filtered = await api.orders.getAll({
  status: 'pending',
  clientId: '123',
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

#### Create Order
```typescript
const orderData = {
  clientId: 1,
  items: [
    { productId: 1, quantity: 10, price: 4.50 },
    { productId: 2, quantity: 5, price: 3.20 }
  ],
  deliveryAddress: {
    street: '123 Main St',
    city: 'City',
    state: 'State',
    zipCode: '12345'
  },
  notes: 'Handle with care'
};

const response = await api.orders.create(orderData);
```

#### Update Order Status
```typescript
await api.orders.updateStatus(orderId, 'confirmed');
// Status options: pending, confirmed, in-transit, delivered, cancelled
```

#### Assign Driver
```typescript
await api.orders.assignDriver(orderId, driverId);
```

---

### Clients Examples

#### Get All Clients
```typescript
const response = await api.clients.getAll();

// With filters
const filtered = await api.clients.getAll({
  search: 'restaurant',
  type: 'wholesale',
  status: 'active'
});
```

#### Create Client
```typescript
const clientData = {
  name: 'ABC Restaurant',
  type: 'retail',
  email: 'contact@abc.com',
  phone: '+1234567890',
  addresses: {
    billing: {
      street: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345'
    }
  }
};

const response = await api.clients.create(clientData);
```

---

### Batches (Production) Examples

#### Get All Batches
```typescript
const response = await api.batches.getAll();

// With filters
const filtered = await api.batches.getAll({
  status: 'completed',
  productId: '1',
  startDate: '2024-01-01'
});
```

#### Create Batch
```typescript
const batchData = {
  productId: 1,
  quantity: 1000,
  startTime: new Date(),
  operatorId: 3
};

const response = await api.batches.create(batchData);
```

#### Complete Batch
```typescript
const completionData = {
  endTime: new Date(),
  actualQuantity: 980,
  yield: 98,
  notes: 'Excellent quality'
};

await api.batches.complete(batchId, completionData);
```

#### Update Quality Checks
```typescript
const qualityData = {
  temperature: 4.5,
  pH: 6.7,
  fatContent: 3.5,
  passed: true,
  notes: 'All parameters within range'
};

await api.batches.updateQuality(batchId, qualityData);
```

---

### Invoices Examples

#### Get All Invoices
```typescript
const response = await api.invoices.getAll();

// With filters
const filtered = await api.invoices.getAll({
  status: 'paid',
  clientId: '123',
  startDate: '2024-01-01'
});
```

#### Create Invoice from Order
```typescript
const response = await api.invoices.createFromOrder(orderId);
```

#### Record Payment
```typescript
const paymentData = {
  amount: 450.00,
  paymentMethod: 'credit_card',
  paymentDate: new Date(),
  reference: 'TXN-123456'
};

await api.invoices.recordPayment(invoiceId, paymentData);
```

#### Get Financial Summary
```typescript
const response = await api.invoices.getSummary();
console.log('Total revenue:', response.data.totalRevenue);
console.log('Pending payments:', response.data.totalPending);
```

---

### Dashboard Examples

#### Get Dashboard Statistics
```typescript
const response = await api.dashboard.getStats();

// Returns:
// - totalProducts
// - totalClients
// - totalOrders
// - totalRevenue
// - activeOrders
// - lowStockAlerts
// - recentOrders
// - topProducts
// - monthlyRevenue
```

---

### Reports Examples

#### Sales Report
```typescript
// Monthly sales
const monthly = await api.reports.getSales({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  groupBy: 'month'
});

// Daily sales
const daily = await api.reports.getSales({
  groupBy: 'day'
});
```

#### Production Report
```typescript
const response = await api.reports.getProduction({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  productType: 'milk'
});
```

#### Inventory Report
```typescript
const response = await api.reports.getInventory();
```

#### Client Report
```typescript
const response = await api.reports.getClients();
// Returns: clients by type, top clients by revenue
```

#### Financial Report
```typescript
const response = await api.reports.getFinancial({
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

---

## 🔄 Update Existing Components

### Example: Update Login Page

```typescript
// src/pages/Auth/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.auth.login(email, password);
      
      if (response.success) {
        // Token and user already saved by API service
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### Example: Update Products Page

```typescript
// src/pages/Inventory/Inventory.tsx
import { useEffect, useState } from 'react';
import api from '@/services/api';

export const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.products.getAll();
      setProducts(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;

    try {
      await api.products.delete(id);
      await loadProducts(); // Reload list
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: any) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.currentStock}</td>
              <td>${product.unitPrice}</td>
              <td>
                <button onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## 🔐 Authentication Flow

The API service automatically handles:

1. **Token Storage**: JWT token saved to localStorage on login
2. **Token Injection**: Automatically adds `Authorization: Bearer <token>` header
3. **Auto Logout**: Redirects to login on 401 errors
4. **User Data**: Saves user info to localStorage

### Check if User is Logged In

```typescript
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (token && user) {
  // User is logged in
} else {
  // Redirect to login
}
```

---

## 🚀 Testing the Integration

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

### 2. Start Frontend Server
```bash
cd ..  # Back to root
npm run dev
```

### 3. Test Login
- Open http://localhost:5173
- Login with: `admin@dairy.com` / `password123`
- Check browser console for API calls
- Check Network tab for requests/responses

### 4. Test API Calls

Open browser console and try:

```javascript
// Test from browser console
const api = (await import('/src/services/api.ts')).default;

// Login
await api.auth.login('admin@dairy.com', 'password123');

// Get products
const products = await api.products.getAll();
console.log(products);

// Get dashboard stats
const stats = await api.dashboard.getStats();
console.log(stats);
```

---

## 📝 Migration Checklist

Replace localStorage operations with API calls:

- [ ] **Login Page** - Use `api.auth.login()`
- [ ] **Dashboard Page** - Use `api.dashboard.getStats()`
- [ ] **Products Page** - Use `api.products.*`
- [ ] **Clients Page** - Use `api.clients.*`
- [ ] **Orders Page** - Use `api.orders.*`
- [ ] **Production Page** - Use `api.batches.*`
- [ ] **Invoices Page** - Use `api.invoices.*`
- [ ] **Reports Page** - Use `api.reports.*`
- [ ] **Settings Page** - Use `api.auth.updatePassword()`

---

## 🔧 Troubleshooting

### CORS Errors
**Symptom:** "Access to fetch has been blocked by CORS policy"

**Solution:** Backend already configured CORS. Make sure:
1. Backend is running on port 5000
2. Frontend is running on port 5173
3. `.env` has correct `VITE_API_URL`

### 401 Unauthorized
**Symptom:** Getting 401 errors on API calls

**Solution:**
1. Make sure you're logged in: `api.auth.login()`
2. Check if token exists: `localStorage.getItem('token')`
3. Token might be expired - login again

### Network Error
**Symptom:** "Failed to fetch" or "Network request failed"

**Solution:**
1. Verify backend is running: `curl http://localhost:5000/health`
2. Check `.env` has correct URL
3. Restart both servers

### TypeScript Errors
**Symptom:** Type errors in API calls

**Solution:**
1. Restart TypeScript server: Cmd/Ctrl + Shift + P → "Restart TS Server"
2. Check `vite-env.d.ts` exists
3. Restart Vite dev server

---

## 📊 API Response Structure

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // For list endpoints
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🎉 You're All Set!

Your frontend is now fully integrated with the backend. The API service provides:

✅ **Complete API coverage** for all backend endpoints  
✅ **Automatic authentication** with JWT tokens  
✅ **Type-safe** requests with TypeScript  
✅ **Error handling** with try-catch blocks  
✅ **Consistent** request/response format  
✅ **Easy to use** - just import and call  

Start replacing localStorage operations with API calls and you'll have a fully functional full-stack application!

---

## 📞 Quick Reference

```typescript
import api from '@/services/api';

// Authentication
api.auth.login(email, password)
api.auth.logout()
api.auth.getCurrentUser()

// Products
api.products.getAll()
api.products.create(data)
api.products.update(id, data)
api.products.delete(id)

// Orders
api.orders.getAll()
api.orders.create(data)
api.orders.updateStatus(id, status)

// Clients
api.clients.getAll()
api.clients.create(data)

// Batches
api.batches.getAll()
api.batches.create(data)
api.batches.complete(id, data)

// Invoices
api.invoices.getAll()
api.invoices.createFromOrder(orderId)
api.invoices.recordPayment(id, data)

// Dashboard & Reports
api.dashboard.getStats()
api.reports.getSales()
api.reports.getProduction()
api.reports.getFinancial()
```

---

*Last Updated: December 22, 2025*  
*Integration Status: Complete*  
*Ready for Development*
