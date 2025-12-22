import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Milk, Package, Truck, Users, DollarSign, BarChart3, Settings, HelpCircle, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar: React.FC = () => {
  const { logout } = useAuth()

  const mainMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Milk, label: 'Production', path: '/production' },
    { icon: Package, label: 'Stock & Inventory', path: '/inventory' },
    { icon: Truck, label: 'Orders & Deliveries', path: '/orders' },
    { icon: Users, label: 'Clients & Relations', path: '/clients' },
    { icon: DollarSign, label: 'Invoicing & Finance', path: '/invoicing' },
    { icon: BarChart3, label: 'Reports & Analytics', path: '/reports' },
  ]

  const secondaryMenuItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Support', path: '#' },
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Milk className="text-primary-500" size={32} />
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">DairyPro</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {mainMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {secondaryMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
