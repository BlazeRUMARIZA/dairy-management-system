import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import role-specific dashboards
import Dashboard from './Dashboard' // Admin/Default dashboard
import ManagerDashboard from '../Manager/ManagerDashboard'
import OperatorDashboard from '../Operator/OperatorDashboard'
import DriverDashboard from '../Driver/DriverDashboard'
import ViewerDashboard from '../Viewer/ViewerDashboard'

/**
 * Smart dashboard component that renders the appropriate dashboard
 * based on the user's role
 */
const RoleDashboard: React.FC = () => {
  const { user } = useAuth()
  const role = user?.role || 'viewer'

  switch (role) {
    case 'admin':
      // Admin gets the full dashboard with all features
      return <Dashboard />
    
    case 'manager':
      // Manager gets KPI-focused dashboard with team overview
      return <ManagerDashboard />
    
    case 'operator':
      // Operator gets production-focused dashboard
      return <OperatorDashboard />
    
    case 'driver':
      // Driver gets delivery-focused dashboard
      return <DriverDashboard />
    
    case 'viewer':
      // Viewer gets read-only overview dashboard
      return <ViewerDashboard />
    
    default:
      // Fallback to viewer dashboard for unknown roles
      return <ViewerDashboard />
  }
}

export default RoleDashboard

