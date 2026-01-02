import React, { useState, useEffect } from 'react'
import { Card } from '../../components/UI/Card'
import { Button } from '../../components/UI/Button'
import { Input } from '../../components/UI/Input'
import { Select } from '../../components/UI/Input'
import { Badge } from '../../components/UI/Badge'
import { Modal } from '../../components/UI/Modal'
import { Users, Package, Settings as SettingsIcon, Save, Plus, Edit, Trash2, Bell, Clock, MapPin } from 'lucide-react'
import api from '../../services/api'

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'system'>('users')
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer'
  })

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    openingTime: '08:00',
    closingTime: '18:00',
    notifications: {
      orderConfirmations: true,
      lowStockAlerts: true,
      expirationWarnings: true,
      paymentReminders: true,
      dailyReports: true
    },
    product: {
      vatRate: 20,
      shelfLife: 7,
      barcodePrefix: 'DRY',
      autoGenerateBarcode: true
    }
  })

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers()
    }
  }, [activeTab])

  const loadUsers = async () => {
    setLoading(true)
    try {
      // Load users from API
      const response = await api.users.getAll()
      if (response.success) {
        setUsers(response.data)
      } else {
        console.error('Failed to load users:', response.message)
        // Fallback to mock data for development
        setUsers([
          { id: 1, name: 'Admin User', email: 'admin@dairy.com', role: 'admin', status: 'active' },
          { id: 2, name: 'Manager User', email: 'manager@dairy.com', role: 'manager', status: 'active' },
          { id: 3, name: 'Operator User', email: 'operator@dairy.com', role: 'operator', status: 'active' },
          { id: 4, name: 'Driver User', email: 'driver@dairy.com', role: 'driver', status: 'active' },
          { id: 5, name: 'Viewer User', email: 'viewer@dairy.com', role: 'viewer', status: 'inactive' },
        ])
      }
    } catch (err) {
      console.error('Failed to load users:', err)
      // Fallback to mock data
      setUsers([
        { id: 1, name: 'Admin User', email: 'admin@dairy.com', role: 'admin', status: 'active' },
        { id: 2, name: 'Manager User', email: 'manager@dairy.com', role: 'manager', status: 'active' },
        { id: 3, name: 'Operator User', email: 'operator@dairy.com', role: 'operator', status: 'active' },
        { id: 4, name: 'Driver User', email: 'driver@dairy.com', role: 'driver', status: 'active' },
        { id: 5, name: 'Viewer User', email: 'viewer@dairy.com', role: 'viewer', status: 'inactive' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = () => {
    setEditMode(false)
    setUserFormData({
      name: '',
      email: '',
      password: '',
      role: 'viewer'
    })
    setShowUserModal(true)
  }

  const handleEditUser = (user: any) => {
    setEditMode(true)
    setSelectedUser(user)
    setUserFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    })
    setShowUserModal(true)
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const response = await api.users.delete(id)
      if (response.success) {
        setUsers(users.filter(u => u.id !== id))
        alert('User deleted successfully')
      } else {
        alert('Failed to delete user: ' + (response.message || 'Unknown error'))
      }
    } catch (err: any) {
      console.error('Failed to delete user:', err)
      alert('Failed to delete user: ' + (err?.message || 'Unknown error'))
    }
  }

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editMode) {
        // Update user via API
        const userData = {
          name: userFormData.name,
          email: userFormData.email,
          role: userFormData.role,
        }
        
        const response = await api.users.update(selectedUser.id, userData)
        
        if (response.success) {
          // Update local state
          setUsers(users.map(u => 
            u.id === selectedUser.id 
              ? { ...u, ...userData }
              : u
          ))
          alert('User updated successfully')
        } else {
          alert('Failed to update user: ' + (response.message || 'Unknown error'))
        }
      } else {
        // Create new user via API
        const response = await api.users.create({
          name: userFormData.name,
          email: userFormData.email,
          password: userFormData.password,
          role: userFormData.role,
        })
        
        if (response.success) {
          // Reload users list to get the new user with proper ID
          await loadUsers()
          alert(`User created successfully!\n\nEmail: ${userFormData.email}\nPassword: ${userFormData.password}\n\nThey can now log in with these credentials.`)
        } else {
          alert('Failed to create user: ' + (response.message || 'Unknown error'))
        }
      }
      setShowUserModal(false)
    } catch (err: any) {
      console.error('Failed to save user:', err)
      alert('Failed to save user: ' + (err?.message || 'Unknown error'))
    }
  }

  const handleSaveSystemSettings = () => {
    // Save to localStorage for persistence
    localStorage.setItem('dairySystemSettings', JSON.stringify(systemSettings))
    alert('System settings saved successfully!')
  }

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('dairySystemSettings')
    if (saved) {
      setSystemSettings(JSON.parse(saved))
    }
  }, [])

  const roleColors = {
    admin: 'danger',
    manager: 'info',
    operator: 'success',
    driver: 'warning',
    viewer: 'default'
  }

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'products', label: 'Product Configuration', icon: Package },
    { id: 'system', label: 'System Settings', icon: SettingsIcon },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Administration & Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure system settings and manage users</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Employee Accounts</h3>
              <Button variant="primary" onClick={handleAddUser}>
                <Plus size={20} className="mr-2" />
                Add Employee
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={roleColors[user.role as keyof typeof roleColors] as any}>{user.role}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={user.status === 'active' ? 'success' : 'default'}>{user.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="secondary" onClick={() => handleEditUser(user)}>
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 size={16} className="mr-1" />
                            Delete
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
      )}

      {/* Product Configuration Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Product Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="VAT Rate (%)" 
                type="number" 
                value={systemSettings.product.vatRate}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  product: { ...systemSettings.product, vatRate: Number(e.target.value) }
                })}
              />
              <Input 
                label="Default Shelf Life (days)" 
                type="number" 
                value={systemSettings.product.shelfLife}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  product: { ...systemSettings.product, shelfLife: Number(e.target.value) }
                })}
              />
            </div>
            <div className="mt-6">
              <Button variant="primary" onClick={handleSaveSystemSettings}>
                <Save size={20} className="mr-2" />
                Save Configuration
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Barcode Settings</h3>
            <div className="space-y-4">
              <Input 
                label="Barcode Prefix" 
                placeholder="e.g., DRY" 
                value={systemSettings.product.barcodePrefix}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  product: { ...systemSettings.product, barcodePrefix: e.target.value }
                })}
              />
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="auto-generate" 
                  className="rounded" 
                  checked={systemSettings.product.autoGenerateBarcode}
                  onChange={(e) => setSystemSettings({
                    ...systemSettings,
                    product: { ...systemSettings.product, autoGenerateBarcode: e.target.checked }
                  })}
                />
                <label htmlFor="auto-generate" className="text-sm">Auto-generate barcodes for new products</label>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* System Settings Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Clock size={20} className="text-primary-500" />
              <h3 className="text-lg font-semibold">Business Hours</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Opening Time" 
                type="time" 
                value={systemSettings.openingTime}
                onChange={(e) => setSystemSettings({ ...systemSettings, openingTime: e.target.value })}
              />
              <Input 
                label="Closing Time" 
                type="time" 
                value={systemSettings.closingTime}
                onChange={(e) => setSystemSettings({ ...systemSettings, closingTime: e.target.value })}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Bell size={20} className="text-primary-500" />
              <h3 className="text-lg font-semibold">Email Notifications</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: 'orderConfirmations', label: 'Order confirmations' },
                { key: 'lowStockAlerts', label: 'Low stock alerts' },
                { key: 'expirationWarnings', label: 'Expiration warnings' },
                { key: 'paymentReminders', label: 'Payment reminders' },
                { key: 'dailyReports', label: 'Daily production reports' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <span className="text-sm">{setting.label}</span>
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    checked={systemSettings.notifications[setting.key as keyof typeof systemSettings.notifications]}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      notifications: {
                        ...systemSettings.notifications,
                        [setting.key]: e.target.checked
                      }
                    })}
                  />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button variant="primary" onClick={handleSaveSystemSettings}>
              <Save size={20} className="mr-2" />
              Save All Settings
            </Button>
          </div>
        </div>
      )}

      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={editMode ? 'Edit Employee' : 'Add New Employee'}
      >
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={userFormData.name}
            onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            required
            value={userFormData.email}
            onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
          />
          {!editMode && (
            <Input
              label="Password"
              type="password"
              required
              value={userFormData.password}
              onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
            />
          )}
          <Select
            label="Role"
            value={userFormData.role}
            onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'manager', label: 'Manager' },
              { value: 'operator', label: 'Operator' },
              { value: 'driver', label: 'Driver' },
              { value: 'viewer', label: 'Viewer' },
            ]}
          />
          <div className="flex space-x-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setShowUserModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editMode ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Settings
