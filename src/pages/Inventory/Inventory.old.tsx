import React, { useState } from 'react'
import { Card } from '../../components/UI/Card'
import { Badge } from '../../components/UI/Badge'
import { Table } from '../../components/UI/Table'
import { Input, Select } from '../../components/UI/Input'
import { Package, AlertTriangle, Search } from 'lucide-react'

const Inventory: React.FC = () => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const products = [
    { id: 1, name: 'Fresh Milk 1L', category: 'Milk', stock: 450, threshold: 200, location: 'Refrigerator 1', expiry: '2025-12-22', status: 'normal' },
    { id: 2, name: 'Yogurt Plain 500g', category: 'Yogurt', stock: 120, threshold: 150, location: 'Refrigerator 2', expiry: '2025-12-25', status: 'low' },
    { id: 3, name: 'Cheddar Cheese 200g', category: 'Cheese', stock: 45, threshold: 100, location: 'Refrigerator 3', expiry: '2026-01-15', status: 'critical' },
    { id: 4, name: 'Heavy Cream 250ml', category: 'Cream', stock: 200, threshold: 100, location: 'Refrigerator 1', expiry: '2025-12-20', status: 'normal' },
    { id: 5, name: 'Greek Yogurt 400g', category: 'Yogurt', stock: 180, threshold: 120, location: 'Refrigerator 2', expiry: '2025-12-23', status: 'normal' },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      normal: 'success',
      low: 'warning',
      critical: 'danger',
    }
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>
  }

  const columns = [
    { key: 'name', label: 'Product' },
    { key: 'category', label: 'Category' },
    {
      key: 'stock',
      label: 'Current Stock',
      render: (item: any) => (
        <div className="flex items-center space-x-2">
          <span>{item.stock}</span>
          {item.stock < item.threshold && <AlertTriangle size={16} className="text-warning" />}
        </div>
      )
    },
    { key: 'location', label: 'Location' },
    { key: 'expiry', label: 'Expiration' },
    { key: 'status', label: 'Status', render: (item: any) => getStatusBadge(item.status) },
  ]

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stockStats = {
    total: products.length,
    normal: products.filter(p => p.status === 'normal').length,
    low: products.filter(p => p.status === 'low').length,
    critical: products.filter(p => p.status === 'critical').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock & Inventory</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your product inventory and stock levels</p>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
              <p className="text-2xl font-semibold">{stockStats.total}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Package className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Normal Stock</p>
              <p className="text-2xl font-semibold">{stockStats.normal}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock</p>
              <p className="text-2xl font-semibold">{stockStats.low}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Critical Stock</p>
              <p className="text-2xl font-semibold">{stockStats.critical}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select
            value={filter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'normal', label: 'Normal' },
              { value: 'low', label: 'Low Stock' },
              { value: 'critical', label: 'Critical' },
            ]}
            className="md:w-48"
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Products Inventory</h3>
        <Table columns={columns} data={filteredProducts} />
      </Card>
    </div>
  )
}

export default Inventory
