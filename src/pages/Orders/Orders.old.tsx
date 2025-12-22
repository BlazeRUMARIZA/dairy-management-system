import React from 'react'
import { Card } from '../../components/UI/Card'
import { Badge } from '../../components/UI/Badge'
import { Button } from '../../components/UI/Button'
import { Calendar, Plus } from 'lucide-react'

const Orders: React.FC = () => {
  const orders = [
    { id: 'ORD-1234', client: 'Restaurant La Belle', products: 'Milk (50L), Cheese (10kg)', status: 'prepared', deliveryDate: '2025-12-20', total: '€450' },
    { id: 'ORD-1235', client: 'SuperMarket Plus', products: 'Yogurt (100 units)', status: 'in-transit', deliveryDate: '2025-12-20', total: '€320' },
    { id: 'ORD-1236', client: 'Cafe Corner', products: 'Cream (20L), Milk (30L)', status: 'pending', deliveryDate: '2025-12-21', total: '€280' },
    { id: 'ORD-1237', client: 'Hotel Grand', products: 'Mixed products', status: 'delivered', deliveryDate: '2025-12-19', total: '€650' },
  ]

  const statusColors = {
    pending: 'warning',
    prepared: 'info',
    'in-transit': 'info',
    delivered: 'success',
    delayed: 'danger',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders & Deliveries</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage orders and track deliveries</p>
        </div>
        <Button variant="primary">
          <Plus size={20} className="mr-2" />
          New Order
        </Button>
      </div>

      {/* Orders Calendar View Placeholder */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Calendar size={24} className="text-primary-500" />
          <h3 className="text-lg font-semibold">Orders Calendar</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Calendar view with drag-and-drop functionality</p>
          <p className="text-sm text-gray-400 mt-2">Interactive calendar coming soon</p>
        </div>
      </Card>

      {/* Orders List */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{order.id}</h4>
                    <Badge variant={statusColors[order.status as keyof typeof statusColors] as any}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="font-medium">{order.client}</span> • {order.products}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Delivery: {order.deliveryDate}</span>
                    <span>Total: {order.total}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">View</Button>
                  <Button size="sm" variant="primary">Track</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Orders
