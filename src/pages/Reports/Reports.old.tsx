import React from 'react'
import { Card } from '../../components/UI/Card'
import { Button } from '../../components/UI/Button'
import { Select } from '../../components/UI/Input'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download, Calendar } from 'lucide-react'

const Reports: React.FC = () => {
  const revenueData = [
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 45000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 43000 },
    { month: 'May', revenue: 51000 },
    { month: 'Jun', revenue: 49000 },
  ]

  const productionCostData = [
    { month: 'Jan', cost: 28000, revenue: 42000 },
    { month: 'Feb', cost: 30000, revenue: 45000 },
    { month: 'Mar', cost: 31000, revenue: 48000 },
    { month: 'Apr', cost: 29000, revenue: 43000 },
    { month: 'May', cost: 33000, revenue: 51000 },
    { month: 'Jun', cost: 32000, revenue: 49000 },
  ]

  const productDistribution = [
    { name: 'Milk', value: 45 },
    { name: 'Yogurt', value: 30 },
    { name: 'Cheese', value: 15 },
    { name: 'Cream', value: 10 },
  ]

  const COLORS = ['#4A90E2', '#50C878', '#FFC107', '#DC3545']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Business intelligence and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <Select
            options={[
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' },
              { value: 'custom', label: 'Custom Range' },
            ]}
          />
          <Button variant="primary">
            <Download size={20} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue (6M)</p>
          <p className="text-3xl font-semibold mt-2">€278,000</p>
          <p className="text-success text-sm mt-2">↑ 15.3% vs last period</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</p>
          <p className="text-3xl font-semibold mt-2">34.2%</p>
          <p className="text-success text-sm mt-2">↑ 2.1% vs last period</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Order Value</p>
          <p className="text-3xl font-semibold mt-2">€425</p>
          <p className="text-danger text-sm mt-2">↓ 3.5% vs last period</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Client Retention</p>
          <p className="text-3xl font-semibold mt-2">92%</p>
          <p className="text-success text-sm mt-2">↑ 5.2% vs last period</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Revenue Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `€${value}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#4A90E2" strokeWidth={2} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Cost vs Revenue */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Production Cost vs Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productionCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `€${value}`} />
              <Legend />
              <Bar dataKey="cost" fill="#DC3545" name="Production Cost" />
              <Bar dataKey="revenue" fill="#50C878" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Product Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Product Sales Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {productDistribution.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Exportable Reports */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Quick Reports</h3>
          <div className="space-y-3">
            {[
              'Daily Production Report',
              'Monthly Stock Status',
              'Accounts Receivable Aging',
              'Salesperson Performance',
              'Product Profitability Analysis',
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center space-x-3">
                  <Calendar size={20} className="text-gray-400" />
                  <span className="text-sm">{report}</span>
                </div>
                <Button size="sm" variant="secondary">
                  <Download size={16} className="mr-1" />
                  Export
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Reports
