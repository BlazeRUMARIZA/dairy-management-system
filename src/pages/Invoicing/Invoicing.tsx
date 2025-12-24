import React, { useState, useEffect } from 'react'
import { Card } from '../../components/UI/Card'
import { Badge } from '../../components/UI/Badge'
import { Button } from '../../components/UI/Button'
import { FileText, DollarSign, AlertCircle, Plus } from 'lucide-react'
import api from '../../services/api'

const Invoicing: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pending: 0,
    overdue: 0,
    collected: 0,
  })

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.invoices.getAll()
      const invoicesData = response.data || []
      setInvoices(invoicesData)
      
      // Calculate stats from invoices
      const totalRevenue = invoicesData.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)
      const pending = invoicesData
        .filter((inv: any) => inv.status === 'sent' || inv.status === 'draft')
        .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)
      const overdue = invoicesData
        .filter((inv: any) => inv.status === 'overdue')
        .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)
      const collected = invoicesData
        .filter((inv: any) => inv.status === 'paid')
        .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)
      
      setStats({
        totalRevenue,
        pending,
        overdue,
        collected,
      })
    } catch (err: any) {
      console.error('Failed to load invoices:', err)
      setError(err.message || 'Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    paid: 'success',
    sent: 'warning',
    draft: 'info',
    overdue: 'danger',
    cancelled: 'danger',
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
              <p className="text-2xl font-semibold">€{Number(stats.totalRevenue || 0).toFixed(2)}</p>
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
              <p className="text-2xl font-semibold">€{Number(stats.collected || 0).toFixed(2)}</p>
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
              <p className="text-2xl font-semibold">€{Number(stats.pending || 0).toFixed(2)}</p>
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
              <p className="text-2xl font-semibold">€{Number(stats.overdue || 0).toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Invoices List */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
        {loading && <p className="text-center py-4">Loading invoices...</p>}
        {error && <p className="text-center py-4 text-red-600">{error}</p>}
        {!loading && !error && (
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
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{invoice.invoiceNumber || `INV-${invoice.id}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{invoice.clientName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">€{Number(invoice.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={statusColors[invoice.status] || 'info'}>{invoice.status}</Badge>
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
        )}
      </Card>
    </div>
  )
}

export default Invoicing
