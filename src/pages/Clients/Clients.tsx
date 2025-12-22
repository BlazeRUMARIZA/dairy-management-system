import React, { useState, useEffect } from 'react'
import { Card } from '../../components/UI/Card'
import { Badge } from '../../components/UI/Badge'
import { Button } from '../../components/UI/Button'
import { Modal } from '../../components/UI/Modal'
import { Input, Select } from '../../components/UI/Input'
import { Users, Plus, Edit, Trash2, Eye, Star, TrendingUp, Package } from 'lucide-react'
import { clientService, orderService } from '../../services/dataService'
import { format } from 'date-fns'

const Clients: React.FC = () => {
  const [clients, setClients] = useState<any[]>([])
  const [showClientModal, setShowClientModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'restaurant',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    paymentTerms: '30',
    deliveryDays: [] as string[],
    deliveryTime: '08:00-10:00',
    notes: ''
  })

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = () => {
    const data = clientService.getAll()
    setClients(data)
  }

  const handleCreate = () => {
    setEditMode(false)
    setFormData({
      name: '',
      type: 'restaurant',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      paymentTerms: '30',
      deliveryDays: [],
      deliveryTime: '08:00-10:00',
      notes: ''
    })
    setShowClientModal(true)
  }

  const handleEdit = (client: any) => {
    setEditMode(true)
    setSelectedClient(client)
    setFormData({
      name: client.name,
      type: client.type,
      email: client.email,
      phone: client.phone,
      address: client.address.street,
      contactPerson: client.contactPerson,
      paymentTerms: client.preferences?.paymentTerms?.toString() || '30',
      deliveryDays: client.preferences?.deliveryDays || [],
      deliveryTime: client.preferences?.deliveryTime || '08:00-10:00',
      notes: client.notes || ''
    })
    setShowClientModal(true)
  }

  const handleView = (client: any) => {
    setSelectedClient(client)
    setShowDetailModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client? All their order history will be preserved but the client profile will be removed.')) {
      clientService.delete(id)
      loadClients()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const clientData = {
      name: formData.name,
      type: formData.type,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.address,
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
      contactPerson: formData.contactPerson,
      billingAddress: {
        street: formData.address,
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
      deliveryAddress: {
        street: formData.address,
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
      preferences: {
        deliveryDays: formData.deliveryDays,
        paymentTerms: parseInt(formData.paymentTerms),
        deliveryTime: formData.deliveryTime
      },
      notes: formData.notes,
      status: 'active',
      rating: 5
    }

    if (editMode && selectedClient) {
      clientService.update(selectedClient.id, clientData)
    } else {
      clientService.create(clientData)
    }

    loadClients()
    setShowClientModal(false)
  }

  const handleDeliveryDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryDays: prev.deliveryDays.includes(day)
        ? prev.deliveryDays.filter(d => d !== day)
        : [...prev.deliveryDays, day]
    }))
  }

  const getClientOrders = (clientId: string) => {
    return orderService.getByClientId(clientId)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ))
  }

  const statusColors: Record<string, 'success' | 'warning' | 'danger'> = {
    active: 'success',
    inactive: 'warning',
    suspended: 'danger'
  }

  const typeLabels: Record<string, string> = {
    restaurant: 'Restaurant',
    grocery: 'Grocery Store',
    hotel: 'Hotel',
    bakery: 'Bakery',
    cafe: 'Café',
    other: 'Other'
  }

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients Directory</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage client relationships and preferences</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <Plus size={20} className="mr-2" />
          New Client
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{clients.length}</p>
            </div>
            <Users className="text-primary-500" size={40} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {clients.filter(c => c.status === 'active').length}
              </p>
            </div>
            <TrendingUp className="text-success-500" size={40} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                €{clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0).toLocaleString()}
              </p>
            </div>
            <Package className="text-info-500" size={40} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(clients.reduce((sum, c) => sum + (c.rating || 0), 0) / clients.length).toFixed(1)}
              </p>
            </div>
            <Star className="text-yellow-500" size={40} />
          </div>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <Card key={client.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {client.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {typeLabels[client.type]}
                  </p>
                </div>
                <Badge variant={statusColors[client.status]}>
                  {client.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">Contact:</span>
                  <span className="font-medium">{client.contactPerson}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-primary-600">{client.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                  <span className="font-medium">{client.phone}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {renderStars(client.rating)}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Orders</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {client.totalOrders}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    €{client.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2 pt-3">
                <Button size="sm" variant="secondary" onClick={() => handleView(client)} className="flex-1">
                  <Eye size={16} className="mr-1" />
                  View
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleEdit(client)}>
                  <Edit size={16} />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(client.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        title={editMode ? 'Edit Client' : 'Add New Client'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Client Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Business Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'restaurant', label: 'Restaurant' },
              { value: 'grocery', label: 'Grocery Store' },
              { value: 'hotel', label: 'Hotel' },
              { value: 'bakery', label: 'Bakery' },
              { value: 'cafe', label: 'Café' },
              { value: 'other', label: 'Other' }
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <Input
            label="Contact Person"
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            required
          />

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Payment Terms (days)"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              options={[
                { value: '15', label: '15 days' },
                { value: '30', label: '30 days' },
                { value: '45', label: '45 days' },
                { value: '60', label: '60 days' }
              ]}
            />
            <Input
              label="Delivery Time"
              value={formData.deliveryTime}
              onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
              placeholder="e.g., 08:00-10:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Delivery Days
            </label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDeliveryDayToggle(day)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    formData.deliveryDays.includes(day)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes about this client..."
          />

          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editMode ? 'Update Client' : 'Add Client'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowClientModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Client Details"
        size="lg"
      >
        {selectedClient && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Client Name</p>
                <p className="font-semibold text-lg">{selectedClient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-semibold">{typeLabels[selectedClient.type]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={statusColors[selectedClient.status]}>
                  {selectedClient.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <div className="flex items-center space-x-1">
                  {renderStars(selectedClient.rating)}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact Person:</span>
                  <span className="font-medium">{selectedClient.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-primary-600">{selectedClient.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{selectedClient.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-right">{selectedClient.address.street}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Business Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedClient.totalOrders}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">€{selectedClient.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-purple-600">€{selectedClient.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Delivery Preferences</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Days:</span>
                  <span className="font-medium">
                    {selectedClient.preferences.deliveryDays.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Preferred Time:</span>
                  <span className="font-medium">{selectedClient.preferences.deliveryTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Terms:</span>
                  <span className="font-medium">{selectedClient.preferences.paymentTerms} days</span>
                </div>
              </div>
            </div>

            {selectedClient.favoriteProducts && selectedClient.favoriteProducts.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Favorite Products</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedClient.favoriteProducts.map((product: string, index: number) => (
                    <Badge key={index} variant="info">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedClient.notes && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                <p className="text-sm font-semibold mb-1">Notes:</p>
                <p className="text-sm">{selectedClient.notes}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Order History</h4>
                <span className="text-sm text-gray-600">
                  Last order: {format(new Date(selectedClient.lastOrderDate), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {getClientOrders(selectedClient.id).length} orders found
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Clients
