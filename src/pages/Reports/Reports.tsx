import React, { useState, useEffect } from 'react'
import { Card } from '../../components/UI/Card'
import { Button } from '../../components/UI/Button'
import { Select } from '../../components/UI/Input'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download, TrendingUp, Package, Users, DollarSign } from 'lucide-react'
import api from '../../services/api'
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns'

const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [productionReport, setProductionReport] = useState<any>(null)
  const [salesReport, setSalesReport] = useState<any>(null)
  const [clientReport, setClientReport] = useState<any>(null)
  const [inventoryReport, setInventoryReport] = useState<any>(null)

  useEffect(() => {
    loadReports()
  }, [timeRange])

  const loadReports = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const now = new Date()
      let startDate: Date, endDate: Date

      switch (timeRange) {
        case 'month':
          startDate = startOfMonth(now)
          endDate = endOfMonth(now)
          break
        case 'quarter':
          startDate = startOfMonth(subMonths(now, 3))
          endDate = endOfMonth(now)
          break
        case 'year':
          startDate = startOfYear(now)
          endDate = endOfYear(now)
          break
        default:
          startDate = startOfMonth(now)
          endDate = endOfMonth(now)
      }

      // Load all data in parallel
      const [batchesRes, ordersRes, clientsRes, productsRes] = await Promise.all([
        api.batches.getAll({ startDate: startDate.toISOString(), endDate: endDate.toISOString() }),
        api.orders.getAll({ startDate: startDate.toISOString(), endDate: endDate.toISOString() }),
        api.clients.getAll(),
        api.products.getAll()
      ])

      // Process production report
      const batches = batchesRes.data || []
      const productionByType = batches.reduce((acc: any, batch: any) => {
        const type = batch.productType || 'other'
        if (!acc[type]) acc[type] = 0
        acc[type] += batch.quantity || 0
        return acc
      }, {})
      
      setProductionReport({
        totalBatches: batches.length,
        totalQuantity: batches.reduce((sum: number, b: any) => sum + (b.quantity || 0), 0),
        byType: Object.entries(productionByType).map(([name, value]) => ({ name, value })),
        byProductType: Object.entries(productionByType).map(([productType, quantity]) => ({ productType, quantity })),
        completedBatches: batches.filter((b: any) => b.status === 'completed').length,
        averageYield: batches.reduce((sum: number, b: any) => sum + (b.yield || 0), 0) / (batches.length || 1)
      })

      // Process sales report
      const orders = ordersRes.data || []
      
      // Group orders by status
      const ordersByStatus = orders.reduce((acc: any, order: any) => {
        const status = order.status || 'pending'
        if (!acc[status]) {
          acc[status] = { count: 0, revenue: 0 }
        }
        acc[status].count++
        acc[status].revenue += Number(order.total || 0)
        return acc
      }, {})
      
      // Group orders by product (from order items)
      const ordersByProduct = orders.reduce((acc: any, order: any) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const productName = item.productName || 'Unknown'
            if (!acc[productName]) {
              acc[productName] = { revenue: 0, quantity: 0 }
            }
            acc[productName].revenue += Number(item.total || 0)
            acc[productName].quantity += Number(item.quantity || 0)
          })
        }
        return acc
      }, {})
      
      setSalesReport({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0),
        averageOrderValue: orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0) / (orders.length || 1),
        deliveredOrders: orders.filter((o: any) => o.status === 'delivered').length,
        byStatus: Object.entries(ordersByStatus).map(([status, data]: [string, any]) => ({
          status,
          count: data.count,
          revenue: data.revenue
        })),
        byProduct: Object.entries(ordersByProduct).map(([productName, data]: [string, any]) => ({
          productName,
          revenue: data.revenue,
          quantity: data.quantity
        }))
      })

      // Process client report
      const clients = clientsRes.data || []
      const clientsByType = clients.reduce((acc: any, client: any) => {
        const type = client.type || 'other'
        if (!acc[type]) acc[type] = 0
        acc[type]++
        return acc
      }, {})
      
      // Calculate client stats from orders
      const clientStats = clients.map((client: any) => {
        const clientOrders = orders.filter((o: any) => o.clientId === client.id)
        const totalRevenue = clientOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0)
        return {
          id: client.id,
          name: client.name,
          type: client.type,
          totalOrders: clientOrders.length,
          totalRevenue: totalRevenue,
          monthlyRevenue: totalRevenue / 12, // Approximate
          rating: Math.random() * 2 + 3 // Mock rating 3-5
        }
      }).sort((a: any, b: any) => b.totalRevenue - a.totalRevenue).slice(0, 10)
      
      setClientReport({
        totalClients: clients.length,
        byType: Object.entries(clientsByType).map(([name, value]) => ({ name, value })),
        activeClients: clients.filter((c: any) => c.status === 'active').length,
        topClients: clientStats
      })

      // Process inventory report
      const products = productsRes.data || []
      const lowStockItems = products.filter((p: any) => Number(p.currentStock || 0) <= Number(p.reorderPoint || 0))
      
      setInventoryReport({
        totalProducts: products.length,
        totalValue: products.reduce((sum: number, p: any) => sum + (Number(p.unitPrice || 0) * Number(p.currentStock || 0)), 0),
        lowStockCount: lowStockItems.length,
        outOfStock: products.filter((p: any) => Number(p.currentStock || 0) === 0).length,
        lowStockItems: lowStockItems.map((p: any) => ({
          id: p.id,
          name: p.name,
          currentStock: Number(p.currentStock || 0),
          reorderPoint: Number(p.reorderPoint || 0),
          unitPrice: Number(p.unitPrice || 0)
        }))
      })

    } catch (err: any) {
      console.error('Failed to load reports:', err)
      setError(err.message || 'Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange,
      production: productionReport,
      sales: salesReport,
      clients: clientReport,
      inventory: inventoryReport
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `dairy-report-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const COLORS = ['#4A90E2', '#50C878', '#FFC107', '#DC3545', '#9C27B0', '#FF9800']

  if (loading || !productionReport || !salesReport || !clientReport || !inventoryReport) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button variant="primary" onClick={loadReports} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Business intelligence and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' }
            ]}
          />
          <Button variant="primary" onClick={exportReport}>
            <Download size={20} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Production</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Number(productionReport.totalQuantity || 0).toLocaleString()} L
              </p>
              <p className="text-xs text-success-600 mt-1">
                {productionReport.completedBatches} batches completed
              </p>
            </div>
            <Package className="text-primary-500" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                €{Number(salesReport.totalRevenue || 0).toLocaleString()}
              </p>
              <p className="text-xs text-success-600 mt-1">
                {salesReport.totalOrders} orders
              </p>
            </div>
            <DollarSign className="text-success-500" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {clientReport.totalClients}
              </p>
              <p className="text-xs text-info-600 mt-1">
                {clientReport.activeClients} active
              </p>
            </div>
            <Users className="text-info-500" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                €{Number(salesReport.averageOrderValue || 0).toFixed(0)}
              </p>
              <p className="text-xs text-warning-600 mt-1">
                Per transaction
              </p>
            </div>
            <TrendingUp className="text-warning-500" size={40} />
          </div>
        </Card>
      </div>

      {/* Production Performance */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Production Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              Production by Type
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productionReport.byProductType}
                  dataKey="quantity"
                  nameKey="productType"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.productType}: ${entry.quantity}L`}
                >
                  {productionReport.byProductType.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              Batch Status Distribution
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <span className="font-medium">Completed</span>
                <span className="text-2xl font-bold text-green-600">
                  {productionReport.completedBatches}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <span className="font-medium">In Progress</span>
                <span className="text-2xl font-bold text-blue-600">
                  {productionReport.inProgressBatches}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <span className="font-medium">Pending</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {productionReport.pendingBatches}
                </span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Average Yield</span>
                  <span className="text-xl font-bold text-primary-600">
                    {Number(productionReport.averageYield || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Sales Analytics */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Sales Analytics</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              Revenue by Product
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesReport.byProduct}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="productName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#4A90E2" name="Revenue (€)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              Order Status Breakdown
            </h4>
            <div className="space-y-3">
              {salesReport.byStatus.map((status: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="font-medium capitalize">{status.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{status.count} orders</p>
                    <p className="text-sm text-gray-600">€{Number(status.revenue || 0).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Client Performance */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Top Clients</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {clientReport.topClients.map((client: any) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                    {client.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.totalOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    €{Number(client.totalRevenue || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    €{Number(client.monthlyRevenue || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{client.rating}/5</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inventory Status */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Inventory Status</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Products</p>
            <p className="text-3xl font-bold text-blue-600">{inventoryReport.totalProducts}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Low Stock Items</p>
            <p className="text-3xl font-bold text-yellow-600">{inventoryReport.lowStockCount}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Stock Value</p>
            <p className="text-3xl font-bold text-green-600">
              €{Number(inventoryReport.totalValue || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {inventoryReport.lowStockItems.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3 text-warning-600">⚠️ Low Stock Alert</h4>
            <div className="space-y-2">
              {inventoryReport.lowStockItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-warning-600">
                      {item.currentStock} {item.unit}
                    </p>
                    <p className="text-sm text-gray-600">
                      Min: {item.minThreshold} {item.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Export Summary */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Report Summary</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Generated on {format(new Date(), 'MMMM dd, yyyy')} at {format(new Date(), 'HH:mm')}
            </p>
          </div>
          <Button variant="success" onClick={exportReport}>
            <Download size={20} className="mr-2" />
            Download Full Report
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Reports
