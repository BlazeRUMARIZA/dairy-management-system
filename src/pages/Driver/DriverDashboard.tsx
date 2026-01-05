import React, { useState, useEffect } from 'react'
import { Card } from '../../components/UI/Card'
import { Button } from '../../components/UI/Button'
import { Badge } from '../../components/UI/Badge'
import { 
  Truck, Package, MapPin, Clock, CheckCircle, 
  Phone, Navigation, AlertCircle, User, Calendar,
  ChevronRight, RefreshCw
} from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

interface Delivery {
  id: number
  orderNumber: string
  clientName: string
  clientPhone: string
  address: string
  city: string
  scheduledTime: string
  status: string
  items: Array<{
    productName: string
    quantity: number
    unit: string
  }>
  notes?: string
  priority: 'normal' | 'urgent' | 'express'
}

const DriverDashboard: React.FC = () => {
  const { user } = useAuth()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [stats, setStats] = useState({
    pending: 0,
    inTransit: 0,
    completed: 0,
    totalToday: 0,
  })

  useEffect(() => {
    loadDeliveries()
  }, [])

  const loadDeliveries = async () => {
    try {
      setLoading(true)
      const response = await api.orders.getAll({ status: 'in_progress' })
      
      // Transform orders to deliveries format
      const ordersData = response.data || []
      const transformedDeliveries: Delivery[] = ordersData.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber || `ORD-${order.id}`,
        clientName: order.client?.name || order.clientName || 'Unknown Client',
        clientPhone: order.client?.phone || order.clientPhone || 'N/A',
        address: order.deliveryAddress || order.client?.address || 'Address not provided',
        city: order.client?.city || 'N/A',
        scheduledTime: order.deliveryDate || order.createdAt,
        status: order.status,
        items: order.items?.map((item: any) => ({
          productName: item.productName || item.product?.name || 'Product',
          quantity: item.quantity,
          unit: item.unit || 'pcs',
        })) || [],
        notes: order.notes || order.specialInstructions,
        priority: order.priority || 'normal',
      }))

      setDeliveries(transformedDeliveries)

      // Calculate stats
      const pending = transformedDeliveries.filter(d => d.status === 'pending' || d.status === 'confirmed').length
      const inTransit = transformedDeliveries.filter(d => d.status === 'in_progress' || d.status === 'in-transit').length
      const completed = transformedDeliveries.filter(d => d.status === 'delivered' || d.status === 'completed').length

      setStats({
        pending,
        inTransit,
        completed,
        totalToday: transformedDeliveries.length,
      })
    } catch (err) {
      console.error('Failed to load deliveries:', err)
      // Use sample data for demonstration
      const sampleDeliveries: Delivery[] = [
        {
          id: 1,
          orderNumber: 'ORD-2024-001',
          clientName: 'Restaurant La Belle Vue',
          clientPhone: '+250 788 123 456',
          address: '123 Avenue de la Paix',
          city: 'Kigali',
          scheduledTime: new Date().toISOString(),
          status: 'in_progress',
          items: [
            { productName: 'Fresh Milk', quantity: 50, unit: 'liters' },
            { productName: 'Plain Yogurt', quantity: 20, unit: 'pcs' },
          ],
          notes: 'Deliver to back entrance',
          priority: 'urgent',
        },
        {
          id: 2,
          orderNumber: 'ORD-2024-002',
          clientName: 'SuperMarket Plus',
          clientPhone: '+250 788 234 567',
          address: '456 Rue du Commerce',
          city: 'Kigali',
          scheduledTime: new Date(Date.now() + 3600000).toISOString(),
          status: 'pending',
          items: [
            { productName: 'Cheddar Cheese', quantity: 10, unit: 'kg' },
            { productName: 'Fresh Butter', quantity: 15, unit: 'pcs' },
          ],
          priority: 'normal',
        },
        {
          id: 3,
          orderNumber: 'ORD-2024-003',
          clientName: 'Hotel Grand Paradise',
          clientPhone: '+250 788 345 678',
          address: '789 Boulevard Central',
          city: 'Kigali',
          scheduledTime: new Date(Date.now() + 7200000).toISOString(),
          status: 'pending',
          items: [
            { productName: 'Whole Milk', quantity: 100, unit: 'liters' },
            { productName: 'Strawberry Yogurt', quantity: 50, unit: 'pcs' },
          ],
          notes: 'Ask for Mr. Jean at reception',
          priority: 'express',
        },
      ]
      setDeliveries(sampleDeliveries)
      setStats({
        pending: 2,
        inTransit: 1,
        completed: 0,
        totalToday: 3,
      })
    } finally {
      setLoading(false)
    }
  }

  const updateDeliveryStatus = async (deliveryId: number, newStatus: string) => {
    try {
      await api.orders.updateStatus(deliveryId, newStatus)
      
      // Update local state
      setDeliveries(prev => prev.map(d => 
        d.id === deliveryId ? { ...d, status: newStatus } : d
      ))

      // Update stats
      loadDeliveries()
      
      // Close detail view if open
      if (selectedDelivery?.id === deliveryId) {
        setSelectedDelivery(null)
      }
    } catch (err) {
      console.error('Failed to update status:', err)
      alert('Failed to update delivery status. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 'warning'
      case 'in_progress':
      case 'in-transit':
        return 'info'
      case 'delivered':
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'express':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Deliveries
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}! Here are your deliveries for today.
          </p>
        </div>
        <Button variant="secondary" onClick={loadDeliveries}>
          <RefreshCw size={20} className="mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">Pending</p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.pending}</p>
            </div>
            <Clock className="text-yellow-600" size={32} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200">In Transit</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.inTransit}</p>
            </div>
            <Truck className="text-blue-600" size={32} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 dark:text-green-200">Completed</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.completed}</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-800 dark:text-purple-200">Total Today</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalToday}</p>
            </div>
            <Calendar className="text-purple-600" size={32} />
          </div>
        </Card>
      </div>

      {/* Delivery List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deliveries List */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="mr-2 text-primary-500" size={24} />
            Today's Deliveries
          </h3>
          
          {deliveries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Truck size={48} className="mx-auto mb-4 opacity-50" />
              <p>No deliveries assigned for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  onClick={() => setSelectedDelivery(delivery)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedDelivery?.id === delivery.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {delivery.orderNumber}
                        </span>
                        {delivery.priority !== 'normal' && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(delivery.priority)}`}>
                            {delivery.priority.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {delivery.clientName}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(delivery.status) as any}>
                      {delivery.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin size={14} className="mr-1" />
                    <span className="truncate">{delivery.address}, {delivery.city}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {formatTime(delivery.scheduledTime)}
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Delivery Details */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Navigation className="mr-2 text-primary-500" size={24} />
            Delivery Details
          </h3>

          {selectedDelivery ? (
            <div className="space-y-4">
              {/* Order Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">{selectedDelivery.orderNumber}</h4>
                  <Badge variant={getStatusColor(selectedDelivery.status) as any} size="lg">
                    {selectedDelivery.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                {selectedDelivery.priority !== 'normal' && (
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm mb-3 ${getPriorityColor(selectedDelivery.priority)}`}>
                    <AlertCircle size={14} className="mr-1" />
                    {selectedDelivery.priority.toUpperCase()} PRIORITY
                  </div>
                )}
              </div>

              {/* Client Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="font-medium">{selectedDelivery.clientName}</p>
                    <a 
                      href={`tel:${selectedDelivery.clientPhone}`}
                      className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                    >
                      <Phone size={14} />
                      {selectedDelivery.clientPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="font-medium">{selectedDelivery.address}</p>
                    <p className="text-sm text-gray-500">{selectedDelivery.city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="font-medium">Scheduled Time</p>
                    <p className="text-sm text-gray-500">{formatTime(selectedDelivery.scheduledTime)}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="border-t pt-4">
                <h5 className="font-medium mb-3 flex items-center">
                  <Package size={16} className="mr-2" />
                  Items to Deliver
                </h5>
                <div className="space-y-2">
                  {selectedDelivery.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span>{item.productName}</span>
                      <span className="font-medium">{item.quantity} {item.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedDelivery.notes && (
                <div className="border-t pt-4">
                  <h5 className="font-medium mb-2 flex items-center text-yellow-600">
                    <AlertCircle size={16} className="mr-2" />
                    Special Instructions
                  </h5>
                  <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200">
                    {selectedDelivery.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t pt-4 space-y-3">
                {(selectedDelivery.status === 'pending' || selectedDelivery.status === 'confirmed') && (
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => updateDeliveryStatus(selectedDelivery.id, 'in_progress')}
                  >
                    <Truck size={20} className="mr-2" />
                    Start Delivery
                  </Button>
                )}

                {(selectedDelivery.status === 'in_progress' || selectedDelivery.status === 'in-transit') && (
                  <Button 
                    variant="success" 
                    className="w-full"
                    onClick={() => updateDeliveryStatus(selectedDelivery.id, 'delivered')}
                  >
                    <CheckCircle size={20} className="mr-2" />
                    Mark as Delivered
                  </Button>
                )}

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedDelivery.address + ', ' + selectedDelivery.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="secondary" className="w-full">
                    <Navigation size={20} className="mr-2" />
                    Open in Maps
                  </Button>
                </a>

                <a href={`tel:${selectedDelivery.clientPhone}`} className="block">
                  <Button variant="secondary" className="w-full">
                    <Phone size={20} className="mr-2" />
                    Call Client
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Navigation size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a delivery to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default DriverDashboard

