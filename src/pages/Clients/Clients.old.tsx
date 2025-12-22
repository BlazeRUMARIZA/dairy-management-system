import React from 'react'
import { Card } from '../../components/UI/Card'
import { Badge } from '../../components/UI/Badge'
import { Button } from '../../components/UI/Button'
import { Table } from '../../components/UI/Table'
import { Building2, Star, Plus } from 'lucide-react'

const Clients: React.FC = () => {
  const clients = [
    { id: 1, name: 'Restaurant La Belle', type: 'Restaurant', contact: 'Jean Dupont', revenue: '€4,500', orders: 45, rating: 5 },
    { id: 2, name: 'SuperMarket Plus', type: 'Grocery', contact: 'Marie Martin', revenue: '€3,800', orders: 38, rating: 4 },
    { id: 3, name: 'Cafe Corner', type: 'Restaurant', contact: 'Pierre Leroux', revenue: '€2,200', orders: 32, rating: 5 },
    { id: 4, name: 'Hotel Grand', type: 'Hotel', contact: 'Sophie Bernard', revenue: '€5,200', orders: 28, rating: 4 },
  ]

  const typeColors = {
    Restaurant: 'info',
    Grocery: 'success',
    Hotel: 'warning',
  }

  const columns = [
    {
      key: 'name',
      label: 'Client',
      render: (item: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <Building2 size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-gray-500">{item.contact}</p>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (item: any) => <Badge variant={typeColors[item.type as keyof typeof typeColors] as any}>{item.type}</Badge>
    },
    { key: 'revenue', label: 'Monthly Revenue' },
    { key: 'orders', label: 'Total Orders' },
    {
      key: 'rating',
      label: 'Satisfaction',
      render: (item: any) => (
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
          ))}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => <Button size="sm" variant="primary">View Details</Button>
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients & Relations</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your client relationships</p>
        </div>
        <Button variant="primary">
          <Plus size={20} className="mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Clients</p>
          <p className="text-3xl font-semibold mt-2">{clients.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Restaurants</p>
          <p className="text-3xl font-semibold mt-2">{clients.filter(c => c.type === 'Restaurant').length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          <p className="text-3xl font-semibold mt-2">€15,700</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Satisfaction</p>
          <p className="text-3xl font-semibold mt-2">4.5 ⭐</p>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Client Directory</h3>
        <Table columns={columns} data={clients} />
      </Card>
    </div>
  )
}

export default Clients
