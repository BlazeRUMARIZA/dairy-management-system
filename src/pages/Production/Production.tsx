import React, { useState, useEffect } from 'react'
import { Card } from '../../components/UI/Card'
import { Button } from '../../components/UI/Button'
import { Badge } from '../../components/UI/Badge'
import { Play, Plus, Edit, Trash2, Eye, CheckCircle } from 'lucide-react'
import { Modal } from '../../components/UI/Modal'
import { Input } from '../../components/UI/Input'
import { Select } from '../../components/UI/Input'
import { batchService } from '../../services/dataService'

const Production: React.FC = () => {
  const [batches, setBatches] = useState<any[]>([])
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    product: '',
    productType: 'milk',
    quantity: '',
    operator: '',
    temperature: '',
    pH: '',
    notes: ''
  })

  useEffect(() => {
    loadBatches()
  }, [])

  const loadBatches = () => {
    const data = batchService.getAll()
    setBatches(data)
  }

  const handleCreate = () => {
    setEditMode(false)
    setFormData({
      product: '',
      productType: 'milk',
      quantity: '',
      operator: '',
      temperature: '',
      pH: '',
      notes: ''
    })
    setShowBatchModal(true)
  }

  const handleEdit = (batch: any) => {
    setEditMode(true)
    setSelectedBatch(batch)
    setFormData({
      product: batch.product,
      productType: batch.productType,
      quantity: batch.quantity.toString(),
      operator: batch.operator,
      temperature: batch.temperature?.toString() || '',
      pH: batch.pH?.toString() || '',
      notes: batch.notes || ''
    })
    setShowBatchModal(true)
  }

  const handleView = (batch: any) => {
    setSelectedBatch(batch)
    setShowDetailModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      batchService.delete(id)
      loadBatches()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const batchData = {
      product: formData.product,
      productType: formData.productType,
      quantity: parseFloat(formData.quantity),
      unit: formData.productType === 'cheese' ? 'kg' : 'L',
      operator: formData.operator,
      operatorId: '1',
      temperature: formData.temperature ? parseFloat(formData.temperature) : null,
      pH: formData.pH ? parseFloat(formData.pH) : null,
      notes: formData.notes,
      yield: 0,
      qualityChecks: {
        temperature: 'pending',
        pH: 'pending',
        bacteria: 'pending'
      }
    }

    if (editMode && selectedBatch) {
      batchService.update(selectedBatch.id, batchData)
    } else {
      batchService.create(batchData)
    }

    loadBatches()
    setShowBatchModal(false)
  }

  const handleStatusChange = (id: string, status: string) => {
    const updates: any = { status }
    
    if (status === 'in-progress') {
      updates.startTime = new Date().toISOString()
    } else if (status === 'completed') {
      updates.endTime = new Date().toISOString()
      updates.yield = Math.floor(Math.random() * 10) + 90
      updates.qualityChecks = {
        temperature: 'pass',
        pH: 'pass',
        bacteria: 'pass'
      }
    }
    
    batchService.update(id, updates)
    loadBatches()
  }

  const batchStatusColors: Record<string, 'success' | 'warning' | 'info'> = {
    completed: 'success',
    'in-progress': 'info',
    pending: 'warning',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Production Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and control production operations</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <Plus size={20} className="mr-2" />
          New Batch
        </Button>
      </div>

      {/* Batches Table */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Production Batches ({batches.length})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {batches.map(batch => (
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{batch.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{batch.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{batch.quantity} {batch.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{batch.operator}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={batchStatusColors[batch.status]}>
                      {batch.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {batch.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="success"
                          onClick={() => handleStatusChange(batch.id, 'in-progress')}
                        >
                          <Play size={16} />
                        </Button>
                      )}
                      {batch.status === 'in-progress' && (
                        <Button 
                          size="sm" 
                          variant="primary"
                          onClick={() => handleStatusChange(batch.id, 'completed')}
                        >
                          <CheckCircle size={16} />
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" onClick={() => handleView(batch)}>
                        <Eye size={16} />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(batch)}>
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(batch.id)}>
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
        isOpen={showBatchModal} 
        onClose={() => setShowBatchModal(false)} 
        title={editMode ? 'Edit Batch' : 'Create New Batch'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            value={formData.product}
            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            required
          />
          <Select
            label="Product Type"
            value={formData.productType}
            onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
            options={[
              { value: 'milk', label: 'Fresh Milk' },
              { value: 'yogurt', label: 'Yogurt' },
              { value: 'cheese', label: 'Cheese' },
            ]}
          />
          <Input 
            label="Quantity" 
            type="number" 
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
          <Input 
            label="Operator" 
            value={formData.operator}
            onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
            required
          />
          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editMode ? 'Update' : 'Create'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowBatchModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Batch Details"
      >
        {selectedBatch && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Batch ID</p>
                <p className="font-semibold">{selectedBatch.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-semibold">{selectedBatch.product}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Production
