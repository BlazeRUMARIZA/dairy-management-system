import React, { useState, useEffect } from 'react'
import { Card } from '../../components/UI/Card'
import { Badge } from '../../components/UI/Badge'
import { Button } from '../../components/UI/Button'
import { Modal } from '../../components/UI/Modal'
import { Input, Select } from '../../components/UI/Input'
import { Package, Plus, Edit, Trash2, Eye, Truck, MapPin, CheckCircle } from 'lucide-react'
import api from '../../services/api'
import { format } from 'date-fns'

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    clientId: '',
    deliveryDate: '',
    deliveryTime: '',
    specialInstructions: '',
    items: [{ productId: '', quantity: 1 }]
  })

  useEffect(() => {
    loadOrders()
    loadClients()
    loadProducts()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.orders.getAll()
      setOrders(response.data || [])
    } catch (err: any) {
      console.error('Failed to load orders:', err)
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const loadClients = async () => {
    try {
      const response = await api.clients.getAll()
      setClients(response.data || [])
    } catch (err: any) {
      console.error('Failed to load clients:', err)
    }
  }

  const loadProducts = async () => {
    try {
      const response = await api.products.getAll()
      setProducts(response.data || [])
    } catch (err: any) {
      console.error('Failed to load products:', err)
    }
  }

  const handleCreate = () => {
    setEditMode(false)
    setFormData({
      clientId: '',
      deliveryDate: '',
      deliveryTime: '',
      specialInstructions: '',
      items: [{ productId: '', quantity: 1 }]
    })
    setShowOrderModal(true)
  }

  const handleEdit = (order: any) => {
    setEditMode(true)
    setSelectedOrder(order)
    setFormData({
      clientId: order.clientId,
      deliveryDate: order.deliveryDate.split('T')[0],
      deliveryTime: order.deliveryTime || '',
      specialInstructions: order.specialInstructions || '',
      items: order.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    })
    setShowOrderModal(true)
  }

  const handleView = (order: any) => {
    // Parse items if it's a JSON string
    const parsedOrder = {
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    }
    setSelectedOrder(parsedOrder)
    setShowDetailModal(true)
  }

  const handleTracking = (order: any) => {
    // Parse items and tracking if they're JSON strings
    const parsedOrder = {
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
      tracking: typeof order.tracking === 'string' ? JSON.parse(order.tracking) : order.tracking
    }
    setSelectedOrder(parsedOrder)
    setShowTrackingModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await api.orders.delete(id)
        await loadOrders()
      } catch (err: any) {
        console.error('Failed to delete order:', err)
        alert('Failed to delete order')
      }
    }
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1 }]
    })
  }

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const calculateOrderTotal = () => {
    return formData.items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId)
      if (product) {
        return total + (product.unitPrice * item.quantity)
      }
      return total
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const client = clients.find(c => c.id === formData.clientId)
    if (!client) return

    const orderItems = formData.items.map(item => {
      const product = products.find(p => p.id === item.productId)
      return {
        productId: item.productId,
        productName: product?.name || '',
        quantity: item.quantity,
        unit: product?.unit || '',
        unitPrice: product?.unitPrice || 0,
        total: (product?.unitPrice || 0) * item.quantity
      }
    })

    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.1
    const total = subtotal + tax

    const orderData = {
      clientId: formData.clientId,
      clientName: client.name,
      items: orderItems,
      subtotal,
      tax,
      total,
      deliveryAddress: client.deliveryAddress,
      deliveryDate: formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      specialInstructions: formData.specialInstructions,
      status: 'pending',
      tracking: {
        status: 'pending',
        events: [],
        notes: '',
        currentLocation: '',
        estimatedDelivery: formData.deliveryDate
      }
    }

    try {
      if (editMode && selectedOrder) {
        await api.orders.update(selectedOrder.id, orderData)
      } else {
        await api.orders.create(orderData)
      }

      await loadOrders()
      setShowOrderModal(false)
    } catch (err: any) {
      console.error('Failed to save order:', err)
      alert('Failed to save order')
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await api.orders.updateStatus(orderId, newStatus)
      await loadOrders()
      
      if (selectedOrder?.id === orderId) {
        const response = await api.orders.getById(orderId)
        setSelectedOrder(response.data)
      }
    } catch (err: any) {
      console.error('Failed to update order status:', err)
      alert('Failed to update order status')
    }
  }

  const statusColors: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
    pending: 'warning',
    preparing: 'info',
    'in-transit': 'info',
    delivered: 'success',
    cancelled: 'danger'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders & Deliveries</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage orders and track deliveries</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <Plus size={20} className="mr-2" />
          New Order
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
            </div>
            <Package className="text-primary-500" size={40} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Transit</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.status === 'in-transit').length}
              </p>
            </div>
            <Truck className="text-info-500" size={40} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
            <CheckCircle className="text-success-500" size={40} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <Package className="text-warning-500" size={40} />
          </div>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">All Orders ({orders.length})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{order.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.items.length} items</td>
                  <td className="px-6 py-4 whitespace-nowrap">€{Number(order.total).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(order.deliveryDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => handleTracking(order)}>
                        <MapPin size={16} />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleView(order)}>
                        <Eye size={16} />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(order)}>
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(order.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={editMode ? 'Edit Order' : 'Create New Order'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Client"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            options={[
              { value: '', label: 'Select a client' },
              ...clients.map(client => ({
                value: client.id,
                label: `${client.name} - ${client.type}`
              }))
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Delivery Date"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              required
            />
            <Input
              label="Delivery Time"
              type="time"
              value={formData.deliveryTime}
              onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Order Items
              </label>
              <Button type="button" size="sm" variant="secondary" onClick={handleAddItem}>
                <Plus size={16} className="mr-1" />
                Add Item
              </Button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="flex space-x-2">
                <Select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  options={[
                    { value: '', label: 'Select product' },
                    ...products.map(product => ({
                      value: product.id,
                      label: `${product.name} - €${product.unitPrice}/${product.unit}`
                    }))
                  ]}
                  required
                />
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  min="1"
                  required
                  className="w-24"
                />
                {formData.items.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Estimated Total:</span>
              <span className="text-xl font-bold text-primary-600">
                €{calculateOrderTotal().toFixed(2)}
              </span>
            </div>
          </div>

          <Input
            label="Special Instructions"
            value={formData.specialInstructions}
            onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
            placeholder="Any special delivery instructions..."
          />

          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editMode ? 'Update Order' : 'Create Order'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowOrderModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-semibold">{selectedOrder.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={statusColors[selectedOrder.status]}>
                  {selectedOrder.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivery Date</p>
                <p className="font-semibold">
                  {format(new Date(selectedOrder.deliveryDate), 'PPP')}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Items</h4>
              <div className="space-y-2">
                {(Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <span>{item.productName} ({item.quantity} {item.unit})</span>
                    <span className="font-semibold">€{Number(item.total).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>€{Number(selectedOrder.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax (10%):</span>
                <span>€{Number(selectedOrder.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary-600">€{Number(selectedOrder.total).toFixed(2)}</span>
              </div>
            </div>

            {selectedOrder.specialInstructions && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                <p className="text-sm font-semibold mb-1">Special Instructions:</p>
                <p className="text-sm">{selectedOrder.specialInstructions}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Tracking Modal */}
      <Modal
        isOpen={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
        title="Order Tracking"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold text-lg">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <Badge variant={statusColors[selectedOrder.status]}>
                  {selectedOrder.status}
                </Badge>
              </div>
            </div>

            {/* Status Update Buttons */}
            <div className="flex space-x-2">
              {selectedOrder.status === 'pending' && (
                <Button
                  variant="primary"
                  onClick={() => handleStatusUpdate(selectedOrder.id, 'preparing')}
                >
                  Start Preparing
                </Button>
              )}
              {selectedOrder.status === 'preparing' && (
                <Button
                  variant="primary"
                  onClick={() => handleStatusUpdate(selectedOrder.id, 'in-transit')}
                >
                  Dispatch for Delivery
                </Button>
              )}
              {selectedOrder.status === 'in-transit' && (
                <Button
                  variant="success"
                  onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}
                >
                  Mark as Delivered
                </Button>
              )}
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h4 className="font-semibold">Tracking History</h4>
              <div className="space-y-3">
                {(selectedOrder.tracking?.events && Array.isArray(selectedOrder.tracking.events) 
                  ? selectedOrder.tracking.events 
                  : []
                ).map((event: any, index: number) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                      {index < (selectedOrder.tracking?.events?.length || 0) - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{event.status}</p>
                          <p className="text-sm text-gray-600">{event.location}</p>
                          {event.notes && (
                            <p className="text-sm text-gray-500 mt-1">{event.notes}</p>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {format(new Date(event.timestamp), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.driverName && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck size={20} className="text-blue-600" />
                  <h4 className="font-semibold">Driver Information</h4>
                </div>
                <p className="text-sm">Driver: {selectedOrder.driverName}</p>
                <p className="text-sm text-gray-600">ID: {selectedOrder.driverId}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Orders
