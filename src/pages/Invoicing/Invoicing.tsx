import React from 'react'
import { Card } from '../../components/UI/Card'
import { Badge } from '../../components/UI/Badge'
import { Button } from '../../components/UI/Button'
import { FileText, DollarSign, AlertCircle, Plus } from 'lucide-react'

const Invoicing: React.FC = () => {
  const invoices = [
    { id: 'INV-2025-001', client: 'Restaurant La Belle', amount: '€450', status: 'paid', date: '2025-12-15', dueDate: '2025-12-30' },
    { id: 'INV-2025-002', client: 'SuperMarket Plus', amount: '€320', status: 'pending', date: '2025-12-18', dueDate: '2026-01-02' },
    { id: 'INV-2025-003', client: 'Hotel Grand', amount: '€650', status: 'overdue', date: '2025-11-25', dueDate: '2025-12-10' },
    { id: 'INV-2025-004', client: 'Cafe Corner', amount: '€280', status: 'paid', date: '2025-12-17', dueDate: '2025-12-31' },
  ]

  const statusColors = {
    paid: 'success',
    pending: 'warning',
    overdue: 'danger',
  }

  const financialStats = {
    totalRevenue: '€1,700',
    pending: '€320',
    overdue: '€650',
    collected: '€730',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoicing & Finance</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage invoices and financial operations</p>
        </div>
        <Button variant="primary">
          <Plus size={20} className="mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-semibold">{financialStats.totalRevenue}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Collected</p>
              <p className="text-2xl font-semibold">{financialStats.collected}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-semibold">{financialStats.pending}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-2xl font-semibold">{financialStats.overdue}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Invoices List */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{invoice.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{invoice.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={statusColors[invoice.status as keyof typeof statusColors] as any}>{invoice.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary">
                        <FileText size={16} className="mr-1" />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Invoicing
