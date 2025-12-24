import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Auth/Login'
import PasswordRecovery from './pages/Auth/PasswordRecovery'
import ResetPassword from './pages/Auth/ResetPassword'
import Dashboard from './pages/Dashboard/Dashboard'
import Production from './pages/Production/Production'
import Inventory from './pages/Inventory/Inventory'
import Orders from './pages/Orders/Orders'
import Clients from './pages/Clients/Clients'
import Invoicing from './pages/Invoicing/Invoicing'
import Reports from './pages/Reports/Reports'
import Settings from './pages/Settings/Settings'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/password-recovery" element={<PasswordRecovery />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="production" element={<Production />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="orders" element={<Orders />} />
              <Route path="clients" element={<Clients />} />
              <Route path="invoicing" element={<Invoicing />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
