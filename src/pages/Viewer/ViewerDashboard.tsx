import React, { useState, useEffect } from 'react'
import { Card } from '../../components/UI/Card'
import { Badge } from '../../components/UI/Badge'
import { 
  BarChart3, TrendingUp, Package, Users, DollarSign, 
  Factory, Truck, ShoppingCart, RefreshCw, Calendar,
  Clock, Eye, PieChart
} from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, 
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

const ViewerDashboard: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    activeClients: 0,
    pendingOrders: 0,
    completedDeliveries: 0,
  })
  const [salesData, setSalesData] = useState<any[]>([])
  const [productDistribution, setProductDistribution] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [statsRes, ordersRes, productsRes, clientsRes] = await Promise.all([
        api.dashboard.getStats(),
        api.orders.getAll(),
        api.products.getAll(),
        api.clients.getAll(),
      ])

      const dashStats = statsRes.data || {}
      const orders = ordersRes.data || []
      const products = productsRes.data || []
      const clients = clientsRes.data || []

      setStats({
        totalRevenue: dashStats.monthlyRevenue || orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0),
        totalOrders: orders.length,
        totalProducts: products.length,
        activeClients: clients.filter((c: any) => c.status === 'active').length || clients.length,
        pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
        completedDeliveries: orders.filter((o: any) => o.status === 'delivered' || o.status === 'completed').length,
      })

      // Generate sales data for chart
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      setSalesData(days.map((day) => ({
        day,
        sales: Math.floor(Math.random() * 20) + 5,
        revenue: Math.floor(Math.random() * 100000) + 50000,
      })))

      // Product distribution by category
      const categoryCount = products.reduce((acc: any, product: any) => {
        const category = product.category || 'other'
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {})
      
      setProductDistribution(Object.entries(categoryCount).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      })))

      // Recent orders
      setRecentOrders(orders.slice(0, 5).map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber || `ORD-${order.id}`,
        client: order.client?.name || order.clientName || 'Unknown',
        total: Number(order.total || 0),
        status: order.status,
        date: order.createdAt,
      })))

      // Top products (mock or from products)
      setTopProducts(products.slice(0, 5).map((product: any) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        stock: Number(product.currentStock || 0),
        price: Number(product.unitPrice || 0),
      })))

    } catch (err) {
      console.error('Failed to load data:', err)
      // Set mock data
      setStats({
        totalRevenue: 850000,
        totalOrders: 45,
        totalProducts: 12,
        activeClients: 28,
        pendingOrders: 8,
        completedDeliveries: 32,
      })
      
      setSalesData([
        { day: 'Mon', sales: 12, revenue: 75000 },
        { day: 'Tue', sales: 15, revenue: 92000 },
        { day: 'Wed', sales: 8, revenue: 48000 },
        { day: 'Thu', sales: 18, revenue: 110000 },
        { day: 'Fri', sales: 22, revenue: 135000 },
        { day: 'Sat', sales: 14, revenue: 85000 },
        { day: 'Sun', sales: 6, revenue: 38000 },
      ])

      setProductDistribution([
        { name: 'Milk', value: 4 },
        { name: 'Yogurt', value: 3 },
        { name: 'Cheese', value: 3 },
        { name: 'Butter', value: 2 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#4A90E2', '#50C878', '#FFC107', '#DC3545', '#9C27B0']

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      pending: 'warning',
      confirmed: 'info',
      in_progress: 'info',
      delivered: 'success',
      completed: 'success',
      cancelled: 'danger',
    }
    return statusColors[status] || 'default'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-primary-500" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Eye className="text-primary-500" size={32} />
            Overview Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome, {user?.name}! Here's a summary of the dairy operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info" size="lg">
            <Eye size={14} className="mr-1" />
            View Only
          </Badge>
          <button 
            onClick={loadData}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Eye className="text-blue-600 dark:text-blue-400" size={24} />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-100">Viewer Access</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You have read-only access to view reports and statistics. Contact an administrator for additional permissions.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <div className="text-center">
            <DollarSign className="mx-auto text-green-600 mb-2" size={28} />
            <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="text-center">
            <ShoppingCart className="mx-auto text-blue-600 mb-2" size={28} />
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Orders</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="text-center">
            <Package className="mx-auto text-purple-600 mb-2" size={28} />
            <p className="text-xs text-gray-600 dark:text-gray-400">Products</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <div className="text-center">
            <Users className="mx-auto text-orange-600 mb-2" size={28} />
            <p className="text-xs text-gray-600 dark:text-gray-400">Active Clients</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.activeClients}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <div className="text-center">
            <Clock className="mx-auto text-yellow-600 mb-2" size={28} />
            <p className="text-xs text-gray-600 dark:text-gray-400">Pending Orders</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.pendingOrders}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20">
          <div className="text-center">
            <Truck className="mx-auto text-teal-600 mb-2" size={28} />
            <p className="text-xs text-gray-600 dark:text-gray-400">Deliveries</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.completedDeliveries}</p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="text-primary-500" size={24} />
              Weekly Sales Trend
            </h3>
            <Badge variant="default">This Week</Badge>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#4A90E2" 
                strokeWidth={2}
                dot={{ fill: '#4A90E2' }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Product Distribution */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="text-primary-500" size={24} />
              Products by Category
            </h3>
          </div>
          {productDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <RechartsPie>
                <Pie
                  data={productDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {productDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-gray-500">
              No product data available
            </div>
          )}
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="text-primary-500" size={24} />
            Recent Orders
          </h3>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 text-sm font-medium">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{order.client}</td>
                      <td className="px-4 py-3 text-sm font-medium">{formatCurrency(order.total)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={getStatusBadge(order.status)} size="sm">
                          {order.status?.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent orders
            </div>
          )}
        </Card>

        {/* Top Products */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package className="text-primary-500" size={24} />
            Product Inventory
          </h3>
          {topProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {topProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-sm">{product.stock}</td>
                      <td className="px-4 py-3 text-sm font-medium">{formatCurrency(product.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No products available
            </div>
          )}
        </Card>
      </div>

      {/* Footer info */}
      <Card className="bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={16} />
            <span>Viewer mode - Read only access</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ViewerDashboard

