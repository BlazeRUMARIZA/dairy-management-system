import React, { useState, useEffect } from 'react'
import { StatCard } from '../../components/UI/Card'
import { Milk, Truck, DollarSign, AlertTriangle, Clock, Loader2 } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../../services/api'

interface DashboardStats {
  todayProduction?: number
  pendingOrders?: number
  criticalStock?: number
  monthlyRevenue?: number
  productionTrend?: number
  ordersTrend?: number
  revenueTrend?: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data for charts (will be replaced with API data later)
  const productionData = [
    { day: 'Mon', milk: 4500, yogurt: 2000, cheese: 800 },
    { day: 'Tue', milk: 4800, yogurt: 2200, cheese: 850 },
    { day: 'Wed', milk: 4600, yogurt: 2100, cheese: 780 },
    { day: 'Thu', milk: 5000, yogurt: 2400, cheese: 900 },
    { day: 'Fri', milk: 5200, yogurt: 2500, cheese: 920 },
    { day: 'Sat', milk: 4900, yogurt: 2300, cheese: 880 },
    { day: 'Sun', milk: 4400, yogurt: 1900, cheese: 750 },
  ]

  const topClientsData = [
    { name: 'Restaurant La Belle', orders: 45 },
    { name: 'SuperMarket Plus', orders: 38 },
    { name: 'Cafe Corner', orders: 32 },
    { name: 'Hotel Grand', orders: 28 },
    { name: 'Bakery Fresh', orders: 25 },
  ]

  const stockRotationData = [
    { day: 'Mon', rotation: 85 },
    { day: 'Tue', rotation: 88 },
    { day: 'Wed', rotation: 82 },
    { day: 'Thu', rotation: 90 },
    { day: 'Fri', rotation: 92 },
    { day: 'Sat', rotation: 87 },
    { day: 'Sun', rotation: 84 },
  ]

  const todaysTasks = [
    { id: 1, title: 'Prepare order #1234 for Restaurant La Belle', priority: 'high', type: 'order' },
    { id: 2, title: 'Quality check batch #5678', priority: 'medium', type: 'production' },
    { id: 3, title: 'Delivery to SuperMarket Plus at 2 PM', priority: 'high', type: 'delivery' },
    { id: 4, title: 'Product expiring: Fresh Milk Batch #3421', priority: 'critical', type: 'expiration' },
    { id: 5, title: 'Restock yogurt in Refrigerator 2', priority: 'medium', type: 'stock' },
  ]

  const priorityColors = {
    critical: 'border-l-4 border-danger bg-red-50 dark:bg-red-900/20',
    high: 'border-l-4 border-warning bg-yellow-50 dark:bg-yellow-900/20',
    medium: 'border-l-4 border-info bg-blue-50 dark:bg-blue-900/20',
  }

  // Fetch dashboard statistics from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.dashboard.getStats()
        
        if (response.success && response.data) {
          setStats(response.data)
        } else {
          throw new Error('Failed to fetch dashboard statistics')
        }
      } catch (err: any) {
        console.error('Failed to fetch dashboard stats:', err)
        setError(err?.message || 'Failed to load dashboard data')
        // Keep empty stats object to show zeros
        setStats({})
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
          <span className="text-red-800 dark:text-red-200">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Show info message if no data */}
      {stats.todayProduction === 0 && stats.pendingOrders === 0 && stats.criticalStock === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-blue-900 dark:text-blue-100 font-medium">No activity data yet</p>
              <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                Statistics will appear here once you start creating products, orders, and batches. 
                Get started by adding your first product or batch!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Production"
          value={stats.todayProduction !== undefined ? `${stats.todayProduction.toLocaleString()} L` : '0 L'}
          trend={stats.productionTrend}
          icon={<Milk size={24} />}
          color="blue"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders !== undefined ? stats.pendingOrders.toString() : '0'}
          trend={stats.ordersTrend}
          icon={<Truck size={24} />}
          color="green"
        />
        <StatCard
          title="Critical Stock Alerts"
          value={stats.criticalStock !== undefined ? stats.criticalStock.toString() : '0'}
          icon={<AlertTriangle size={24} />}
          color="red"
        />
        <StatCard
          title="Monthly Revenue"
          value={stats.monthlyRevenue !== undefined ? `$${stats.monthlyRevenue.toLocaleString()}` : '$0'}
          trend={stats.revenueTrend}
          icon={<DollarSign size={24} />}
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Production */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Weekly Production</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="milk" stroke="#4A90E2" strokeWidth={2} />
              <Line type="monotone" dataKey="yogurt" stroke="#50C878" strokeWidth={2} />
              <Line type="monotone" dataKey="cheese" stroke="#FFC107" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 Clients */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Top 5 Clients This Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topClientsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="orders" fill="#4A90E2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Rotation and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Rotation */}
        <div className="card lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Stock Rotation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stockRotationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="rotation" stroke="#50C878" fill="#50C878" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Today's Tasks */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Today's Tasks</h3>
            <span className="text-sm text-gray-500">{todaysTasks.length} tasks</span>
          </div>
          <div className="space-y-3">
            {todaysTasks.map(task => (
              <div
                key={task.id}
                className={`p-4 rounded-lg ${priorityColors[task.priority as keyof typeof priorityColors]}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{task.type}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{task.priority} priority</span>
                    </div>
                  </div>
                  <Clock size={16} className="text-gray-400 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
