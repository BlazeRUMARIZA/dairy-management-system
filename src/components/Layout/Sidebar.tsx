import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, Milk, Package, Truck, Users, DollarSign, BarChart3, 
  Settings, HelpCircle, LogOut, ClipboardList, Factory, Eye,
  LucideIcon
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getRoleDisplayName, getRoleColor } from '../../utils/rolePermissions'

interface MenuItem {
  icon: LucideIcon
  label: string
  path: string
  roles?: string[] // If undefined, available to all roles
}

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth()
  const userRole = user?.role || 'viewer'

  // Define all menu items with role restrictions
  const allMenuItems: MenuItem[] = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/dashboard',
      // All roles can see dashboard
    },
    { 
      icon: Truck, 
      label: 'My Deliveries', 
      path: '/deliveries',
      roles: ['driver'],
    },
    { 
      icon: ClipboardList, 
      label: 'My Tasks', 
      path: '/my-tasks',
      roles: ['operator'],
    },
    { 
      icon: Factory, 
      label: 'Production', 
      path: '/production',
      roles: ['admin', 'manager', 'operator'],
    },
    { 
      icon: Package, 
      label: 'Stock & Inventory', 
      path: '/inventory',
      roles: ['admin', 'manager', 'operator'],
    },
    { 
      icon: Truck, 
      label: 'Orders & Deliveries', 
      path: '/orders',
      roles: ['admin', 'manager'],
    },
    { 
      icon: Users, 
      label: 'Clients & Relations', 
      path: '/clients',
      roles: ['admin', 'manager'],
    },
    { 
      icon: DollarSign, 
      label: 'Invoicing & Finance', 
      path: '/invoicing',
      roles: ['admin', 'manager'],
    },
    { 
      icon: BarChart3, 
      label: 'Reports & Analytics', 
      path: '/reports',
      roles: ['admin', 'manager', 'viewer'],
    },
  ]

  const secondaryMenuItems: MenuItem[] = [
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings',
      roles: ['admin'],
    },
    { 
      icon: HelpCircle, 
      label: 'Support', 
      path: '/support',
    },
  ]

  // Filter menu items based on user role
  const filterByRole = (items: MenuItem[]) => {
    return items.filter(item => {
      if (!item.roles) return true // Available to all if no roles specified
      return item.roles.includes(userRole)
    })
  }

  const mainMenuItems = filterByRole(allMenuItems)
  const filteredSecondaryItems = filterByRole(secondaryMenuItems)

  // Get role-specific dashboard icon
  const getRoleIcon = () => {
    switch (userRole) {
      case 'driver': return Truck
      case 'operator': return Factory
      case 'viewer': return Eye
      default: return Milk
    }
  }

  const RoleIcon = getRoleIcon()

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Milk className="text-primary-600 dark:text-primary-400" size={28} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">DairyPro</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* User Role Badge */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name || 'User'}
            </p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(userRole)}`}>
              <RoleIcon size={12} className="mr-1" />
              {getRoleDisplayName(userRole)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Menu
        </p>
        {mainMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
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
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
        {filteredSecondaryItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      {/* Role-specific quick info */}
      {userRole === 'driver' && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Truck size={16} />
              <span className="text-xs font-medium">Driver Mode</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              View and manage your deliveries
            </p>
          </div>
        </div>
      )}

      {userRole === 'operator' && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Factory size={16} />
              <span className="text-xs font-medium">Operator Mode</span>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Manage production batches
            </p>
          </div>
        </div>
      )}

      {userRole === 'viewer' && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Eye size={16} />
              <span className="text-xs font-medium">View Only</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Read-only access to reports
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
