import React, { useState } from 'react'
import { Card } from '../../components/UI/Card'
import { Button } from '../../components/UI/Button'
import { Input } from '../../components/UI/Input'
import { Select } from '../../components/UI/Input'
import { Badge } from '../../components/UI/Badge'
import { Users, Package, Settings as SettingsIcon, Save } from 'lucide-react'

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'system'>('users')

  const users = [
    { id: 1, name: 'John Dairy', email: 'john@dairy.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@dairy.com', role: 'Production', status: 'active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@dairy.com', role: 'Delivery', status: 'inactive' },
  ]

  const roleColors = {
    Admin: 'danger',
    Production: 'info',
    Sales: 'success',
    Delivery: 'warning',
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
              <Button variant="primary">Add Employee</Button>
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
                          <Button size="sm" variant="secondary">Edit</Button>
                          <Button size="sm" variant="danger">Delete</Button>
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
            <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Category Name" placeholder="e.g., Milk Products" />
              <Select
                label="Measurement Unit"
                options={[
                  { value: 'liter', label: 'Liter' },
                  { value: 'kilogram', label: 'Kilogram' },
                  { value: 'unit', label: 'Unit' },
                ]}
              />
              <Input label="VAT Rate (%)" type="number" placeholder="e.g., 20" />
              <Input label="Default Shelf Life (days)" type="number" placeholder="e.g., 7" />
            </div>
            <div className="mt-6">
              <Button variant="primary">
                <Save size={20} className="mr-2" />
                Save Configuration
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Barcode Settings</h3>
            <div className="space-y-4">
              <Input label="Barcode Prefix" placeholder="e.g., DRY" />
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auto-generate" className="rounded" />
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
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Opening Time" type="time" defaultValue="08:00" />
              <Input label="Closing Time" type="time" defaultValue="18:00" />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Delivery Zones</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Input label="Zone Name" placeholder="e.g., Downtown" />
                <Input label="Base Fee (€)" type="number" placeholder="10" />
                <Input label="Extra Fee/km (€)" type="number" placeholder="1.5" />
              </div>
              <Button variant="secondary">Add Zone</Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
            <div className="space-y-3">
              {[
                'Order confirmations',
                'Low stock alerts',
                'Expiration warnings',
                'Payment reminders',
                'Daily production reports',
              ].map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <span className="text-sm">{setting}</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button variant="primary">
              <Save size={20} className="mr-2" />
              Save All Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
