import React, { useState } from 'react'
import { Card } from '../../components/UI/Card'
import { Button } from '../../components/UI/Button'
import { Input } from '../../components/UI/Input'
import { Badge } from '../../components/UI/Badge'
import { Modal } from '../../components/UI/Modal'
import { 
  User, Mail, Phone, Shield, Clock, Calendar, 
  Edit, Lock, Save, Camera, Check, X, AlertCircle
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getRoleDisplayName, getRoleColor, getRolePermissions } from '../../utils/rolePermissions'
import api from '../../services/api'

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const userRole = user?.role || 'viewer'
  const permissions = getRolePermissions(userRole)

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      // In production, this would call the API
      // await api.users.update(user?.id, formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setEditing(false)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters!' })
      return
    }

    try {
      setSaving(true)
      await api.auth.updatePassword(passwordData.currentPassword, passwordData.newPassword)
      
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setShowPasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to change password.' })
    } finally {
      setSaving(false)
    }
  }

  const permissionsList = [
    { key: 'canManageUsers', label: 'Manage Users', description: 'Create, edit, and delete user accounts' },
    { key: 'canManageProducts', label: 'Manage Products', description: 'Add, edit, and remove products from inventory' },
    { key: 'canManageOrders', label: 'Manage Orders', description: 'Create and modify customer orders' },
    { key: 'canManageClients', label: 'Manage Clients', description: 'Add and edit client information' },
    { key: 'canManageProduction', label: 'Manage Production', description: 'Create and manage production batches' },
    { key: 'canManageInvoices', label: 'Manage Invoices', description: 'Create and manage invoices' },
    { key: 'canViewReports', label: 'View Reports', description: 'Access reports and analytics' },
    { key: 'canUpdateDeliveryStatus', label: 'Update Deliveries', description: 'Update delivery status' },
    { key: 'canAccessSettings', label: 'Access Settings', description: 'Modify system settings' },
    { key: 'canExportData', label: 'Export Data', description: 'Export data and reports' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <User className="text-primary-500" size={32} />
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage your account information
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-800 dark:text-red-200'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
          <button 
            onClick={() => setMessage(null)}
            className="ml-auto hover:opacity-70"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            {/* Avatar */}
            <div className="relative inline-block">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4A90E2&color=fff&size=128`}
                alt={user?.name}
                className="w-32 h-32 rounded-full mx-auto border-4 border-white dark:border-gray-700 shadow-lg"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors">
                <Camera size={16} />
              </button>
            </div>

            {/* Name & Role */}
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            
            <div className="mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(userRole)}`}>
                <Shield size={14} className="mr-1" />
                {getRoleDisplayName(userRole)}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary-600">
                    {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500">Member Since</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                  <p className="text-xs text-gray-500">Account Status</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Account Information</h3>
            {!editing ? (
              <Button variant="secondary" onClick={() => setEditing(true)}>
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveProfile} disabled={saving}>
                  <Save size={16} className="mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {editing ? (
              <>
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <User className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Shield className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="font-medium">{getRoleDisplayName(userRole)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Clock className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Last Login</p>
                    <p className="font-medium">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Change Password */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
              <Lock size={16} className="mr-2" />
              Change Password
            </Button>
          </div>
        </Card>

        {/* Permissions */}
        <Card className="lg:col-span-3">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="text-primary-500" size={24} />
            My Permissions
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Your access level as a <strong>{getRoleDisplayName(userRole)}</strong>:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permissionsList.map((perm) => {
              const hasPermission = permissions[perm.key as keyof typeof permissions]
              return (
                <div 
                  key={perm.key}
                  className={`p-4 rounded-lg border ${
                    hasPermission 
                      ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                      : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1 rounded ${hasPermission ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                      {hasPermission ? <Check size={14} /> : <X size={14} />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{perm.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{perm.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleChangePassword} disabled={saving}>
              {saving ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Profile

