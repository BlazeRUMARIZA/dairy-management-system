import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Auth/Login'
import PasswordRecovery from './pages/Auth/PasswordRecovery'
import ResetPassword from './pages/Auth/ResetPassword'
import RoleDashboard from './pages/Dashboard/RoleDashboard'
import Production from './pages/Production/Production'
import Inventory from './pages/Inventory/Inventory'
import Orders from './pages/Orders/Orders'
import Clients from './pages/Clients/Clients'
import Invoicing from './pages/Invoicing/Invoicing'
import Reports from './pages/Reports/Reports'
import Settings from './pages/Settings/Settings'
import Support from './pages/Support/Support'
import DriverDashboard from './pages/Driver/DriverDashboard'
import OperatorDashboard from './pages/Operator/OperatorDashboard'
import Profile from './pages/Profile/Profile'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/password-recovery" element={<PasswordRecovery />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* Role-based Dashboard - Shows appropriate dashboard based on user role */}
              <Route path="dashboard" element={<RoleDashboard />} />
              
              {/* Driver-specific routes */}
              <Route path="deliveries" element={<DriverDashboard />} />
              
              {/* Operator-specific routes */}
              <Route path="my-tasks" element={<OperatorDashboard />} />
              
              {/* Common routes with role-based access control in Sidebar */}
              <Route path="production" element={<Production />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="orders" element={<Orders />} />
              <Route path="clients" element={<Clients />} />
              <Route path="invoicing" element={<Invoicing />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="support" element={<Support />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
