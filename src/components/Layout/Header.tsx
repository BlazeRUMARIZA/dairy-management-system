import React, { useState } from 'react'
import { Search, Bell, Sun, Moon, Palette } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { format } from 'date-fns'

const Header: React.FC = () => {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  const themeIcon = theme === 'dark' ? <Moon size={20} /> : theme === 'fresh' ? <Palette size={20} /> : <Sun size={20} />

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders, clients, products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Date & Time */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {format(new Date(), 'PPP')}
          </div>

          {/* Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {themeIcon}
            </button>
            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                <button
                  onClick={() => { setTheme('light'); setShowThemeMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Sun size={16} />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => { setTheme('dark'); setShowThemeMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Moon size={16} />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => { setTheme('fresh'); setShowThemeMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Palette size={16} />
                  <span>Fresh</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
