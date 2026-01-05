import React, { useState, useEffect } from 'react'
import { Card, StatCard } from '../../components/UI/Card'
import { Button } from '../../components/UI/Button'
import { Badge } from '../../components/UI/Badge'
import { 
  TrendingUp, TrendingDown, DollarSign, Package, Users, 
  ShoppingCart, Factory, AlertTriangle, CheckCircle, Clock,
  BarChart3, PieChart, RefreshCw, ArrowUpRight, ArrowDownRight,
  Target, Award, Zap
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

interface KPIData {
  revenue: { current: number; previous: number; trend: number }
  orders: { current: number; previous: number; trend: number }
  production: { current: number; previous: number; trend: number }
  clients: { active: number; new: number; churned: number }
}

interface TeamMember {
  id: number
  name: string
  role: string
  status: 'online' | 'offline' | 'busy'
  tasksCompleted: number
  performance: number
}

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<KPIData>({
    revenue: { current: 0, previous: 0, trend: 0 },
    orders: { current: 0, previous: 0, trend: 0 },
    production: { current: 0, previous: 0, trend: 0 },
    clients: { active: 0, new: 0, churned: 0 },
  })
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  // Chart data
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [productionData, setProductionData] = useState<any[]>([])
  const [orderStatusData, setOrderStatusData] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard stats
      const [statsRes, ordersRes, productsRes, clientsRes] = await Promise.all([
        api.dashboard.getStats(),
        api.orders.getAll(),
        api.products.getAll(),
        api.clients.getAll(),
      ])

      const stats = statsRes.data || {}
      const orders = ordersRes.data || []
      const products = productsRes.data || []
      const clients = clientsRes.data || []

      // Calculate KPIs
      const monthlyRevenue = stats.monthlyRevenue || 0
      const previousRevenue = monthlyRevenue * 0.85 // Simulated previous month
      
      setKpis({
        revenue: {
          current: monthlyRevenue,
          previous: previousRevenue,
          trend: ((monthlyRevenue - previousRevenue) / (previousRevenue || 1)) * 100,
        },
        orders: {
          current: orders.length,
          previous: Math.floor(orders.length * 0.9),
          trend: 11.1,
        },
        production: {
          current: stats.todayProduction || 0,
          previous: (stats.todayProduction || 0) * 0.95,
          trend: stats.productionTrend || 5.2,
        },
        clients: {
          active: clients.filter((c: any) => c.status === 'active').length || clients.length,
          new: Math.floor(clients.length * 0.15),
          churned: Math.floor(clients.length * 0.02),
        },
      })

      // Generate chart data
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      setRevenueData(days.map((day, i) => ({
        day,
        revenue: Math.floor(Math.random() * 50000) + 30000,
        orders: Math.floor(Math.random() * 20) + 10,
      })))

      setProductionData(days.map((day, i) => ({
        day,
        milk: Math.floor(Math.random() * 2000) + 3000,
        yogurt: Math.floor(Math.random() * 500) + 800,
        cheese: Math.floor(Math.random() * 200) + 300,
      })))

      // Order status breakdown
      const ordersByStatus = orders.reduce((acc: any, order: any) => {
        const status = order.status || 'pending'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {})

      setOrderStatusData(Object.entries(ordersByStatus).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value,
      })))

      // Set team members (mock data)
      setTeamMembers([
        { id: 1, name: 'Jean Operator', role: 'operator', status: 'online', tasksCompleted: 12, performance: 95 },
        { id: 2, name: 'Marie Driver', role: 'driver', status: 'busy', tasksCompleted: 8, performance: 88 },
        { id: 3, name: 'Paul Operator', role: 'operator', status: 'online', tasksCompleted: 10, performance: 92 },
        { id: 4, name: 'Anne Driver', role: 'driver', status: 'offline', tasksCompleted: 15, performance: 97 },
      ])

      // Recent activities
      setRecentActivities([
        { id: 1, type: 'order', message: 'New order #ORD-2024-156 from Restaurant La Belle', time: '5 min ago', icon: ShoppingCart },
        { id: 2, type: 'production', message: 'Batch #BATCH-2024-089 completed production', time: '15 min ago', icon: Factory },
        { id: 3, type: 'alert', message: 'Low stock alert: Fresh Milk below threshold', time: '30 min ago', icon: AlertTriangle },
        { id: 4, type: 'delivery', message: 'Delivery #DEL-2024-045 completed successfully', time: '1 hour ago', icon: CheckCircle },
        { id: 5, type: 'client', message: 'New client registered: Hotel Paradise', time: '2 hours ago', icon: Users },
      ])

    } catch (err) {
      console.error('Failed to load dashboard:', err)
      // Set mock data
      setKpis({
        revenue: { current: 1250000, previous: 1100000, trend: 13.6 },
        orders: { current: 156, previous: 142, trend: 9.9 },
        production: { current: 4500, previous: 4200, trend: 7.1 },
        clients: { active: 48, new: 7, churned: 1 },
      })
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#4A90E2', '#50C878', '#FFC107', '#DC3545', '#9C27B0', '#FF9800']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(value)
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manager Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}! Here's your business overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadDashboardData}>
            <RefreshCw size={20} className="mr-2" />
            Refresh
          </Button>
          <Button variant="primary">
            <BarChart3 size={20} className="mr-2" />
            Full Reports
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue KPI */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Monthly Revenue</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                {formatCurrency(kpis.revenue.current)}
              </p>
              <div className="flex items-center mt-2">
                {kpis.revenue.trend >= 0 ? (
                  <ArrowUpRight className="text-green-600" size={16} />
                ) : (
                  <ArrowDownRight className="text-red-600" size={16} />
                )}
                <span className={`text-sm font-medium ${kpis.revenue.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(kpis.revenue.trend).toFixed(1)}% vs last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-200 dark:bg-green-800 rounded-lg">
              <DollarSign className="text-green-700 dark:text-green-200" size={24} />
            </div>
          </div>
        </Card>

        {/* Orders KPI */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Orders</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                {kpis.orders.current}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="text-blue-600" size={16} />
                <span className="text-sm font-medium text-blue-600">
                  +{kpis.orders.current - kpis.orders.previous} this month
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-lg">
              <ShoppingCart className="text-blue-700 dark:text-blue-200" size={24} />
            </div>
          </div>
        </Card>

        {/* Production KPI */}
        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Today's Production</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {kpis.production.current.toLocaleString()} L
              </p>
              <div className="flex items-center mt-2">
                {kpis.production.trend >= 0 ? (
                  <TrendingUp className="text-purple-600" size={16} />
                ) : (
                  <TrendingDown className="text-red-600" size={16} />
                )}
                <span className={`text-sm font-medium ${kpis.production.trend >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                  {Math.abs(kpis.production.trend).toFixed(1)}% vs yesterday
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-lg">
              <Factory className="text-purple-700 dark:text-purple-200" size={24} />
            </div>
          </div>
        </Card>

        {/* Clients KPI */}
        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Active Clients</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
                {kpis.clients.active}
              </p>
              <div className="flex items-center mt-2 gap-3">
                <span className="text-sm text-green-600">+{kpis.clients.new} new</span>
                <span className="text-sm text-red-600">-{kpis.clients.churned} churned</span>
              </div>
            </div>
            <div className="p-3 bg-orange-200 dark:bg-orange-800 rounded-lg">
              <Users className="text-orange-700 dark:text-orange-200" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Revenue & Orders Trend</h3>
            <Badge variant="success">This Week</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4A90E2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]}
              />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#4A90E2" fill="url(#colorRevenue)" name="Revenue" />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#50C878" strokeWidth={2} name="Orders" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Production Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Production by Product</h3>
            <Badge variant="info">This Week</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="milk" fill="#4A90E2" name="Milk (L)" />
              <Bar dataKey="yogurt" fill="#50C878" name="Yogurt (L)" />
              <Bar dataKey="cheese" fill="#FFC107" name="Cheese (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Team and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Performance */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="mr-2 text-primary-500" size={24} />
            Team Overview
          </h3>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0)}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{member.tasksCompleted} tasks</p>
                  <div className="flex items-center gap-1">
                    <Zap size={12} className="text-yellow-500" />
                    <span className="text-xs text-gray-500">{member.performance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2 text-primary-500" size={24} />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'alert' ? 'bg-red-100 text-red-600' :
                  activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'production' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'delivery' ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <activity.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Order Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Breakdown */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Order Status</h3>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {orderStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">No order data</p>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="mr-2 text-yellow-500" size={24} />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-center">
              <ShoppingCart className="mx-auto mb-2 text-blue-600" size={28} />
              <p className="text-sm font-medium">New Order</p>
            </button>
            <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-center">
              <Factory className="mx-auto mb-2 text-purple-600" size={28} />
              <p className="text-sm font-medium">New Batch</p>
            </button>
            <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-center">
              <Users className="mx-auto mb-2 text-green-600" size={28} />
              <p className="text-sm font-medium">Add Client</p>
            </button>
            <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors text-center">
              <BarChart3 className="mx-auto mb-2 text-orange-600" size={28} />
              <p className="text-sm font-medium">View Reports</p>
            </button>
          </div>

          {/* Targets */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Monthly Targets</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Revenue Target</span>
                  <span className="font-medium">{((kpis.revenue.current / 1500000) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${Math.min((kpis.revenue.current / 1500000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Orders Target</span>
                  <span className="font-medium">{((kpis.orders.current / 200) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${Math.min((kpis.orders.current / 200) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Production Target</span>
                  <span className="font-medium">{((kpis.production.current / 5000) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${Math.min((kpis.production.current / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ManagerDashboard

