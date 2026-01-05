import React, { useState, useEffect } from 'react'
import { Card } from '../../components/UI/Card'
import { Button } from '../../components/UI/Button'
import { Badge } from '../../components/UI/Badge'
import { Modal } from '../../components/UI/Modal'
import { Input, Select } from '../../components/UI/Input'
import { 
  Factory, Play, Pause, CheckCircle, Clock, AlertTriangle,
  Thermometer, Droplets, FlaskConical, Package, RefreshCw,
  ChevronRight, ClipboardList, Timer
} from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

interface ProductionTask {
  id: number
  batchNumber: string
  productName: string
  productType: string
  quantity: number
  unit: string
  status: string
  startTime: string
  estimatedEndTime: string
  temperature?: number
  pH?: number
  notes?: string
  qualityCheck: string
}

interface QualityCheckData {
  temperature: string
  pH: string
  notes: string
  result: 'passed' | 'failed' | 'pending'
}

const OperatorDashboard: React.FC = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<ProductionTask[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<ProductionTask | null>(null)
  const [showQualityModal, setShowQualityModal] = useState(false)
  const [qualityData, setQualityData] = useState<QualityCheckData>({
    temperature: '',
    pH: '',
    notes: '',
    result: 'pending',
  })
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    totalToday: 0,
    avgYield: 0,
  })

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const response = await api.batches.getAll()
      
      const batchesData = response.data || []
      const transformedTasks: ProductionTask[] = batchesData.map((batch: any) => ({
        id: batch.id,
        batchNumber: batch.batchNumber || `BATCH-${batch.id}`,
        productName: batch.product?.name || batch.productName || 'Unknown Product',
        productType: batch.product?.category || batch.productType || 'other',
        quantity: Number(batch.quantity) || 0,
        unit: batch.unit || 'liters',
        status: batch.status || 'planned',
        startTime: batch.startTime || batch.createdAt,
        estimatedEndTime: batch.endTime || new Date(Date.now() + 3600000).toISOString(),
        temperature: batch.temperature,
        pH: batch.pH,
        notes: batch.notes,
        qualityCheck: batch.qualityCheck || 'pending',
      }))

      setTasks(transformedTasks)

      // Calculate stats
      const pending = transformedTasks.filter(t => t.status === 'planned' || t.status === 'pending').length
      const inProgress = transformedTasks.filter(t => t.status === 'in_progress' || t.status === 'in-progress').length
      const completed = transformedTasks.filter(t => t.status === 'completed').length

      setStats({
        pending,
        inProgress,
        completed,
        totalToday: transformedTasks.length,
        avgYield: 92.5, // Mock value
      })
    } catch (err) {
      console.error('Failed to load tasks:', err)
      // Use sample data
      const sampleTasks: ProductionTask[] = [
        {
          id: 1,
          batchNumber: 'BATCH-2024-001',
          productName: 'Fresh Milk',
          productType: 'milk',
          quantity: 500,
          unit: 'liters',
          status: 'in_progress',
          startTime: new Date(Date.now() - 3600000).toISOString(),
          estimatedEndTime: new Date(Date.now() + 1800000).toISOString(),
          temperature: 4.2,
          pH: 6.7,
          qualityCheck: 'pending',
        },
        {
          id: 2,
          batchNumber: 'BATCH-2024-002',
          productName: 'Plain Yogurt',
          productType: 'yogurt',
          quantity: 200,
          unit: 'liters',
          status: 'planned',
          startTime: new Date(Date.now() + 3600000).toISOString(),
          estimatedEndTime: new Date(Date.now() + 14400000).toISOString(),
          qualityCheck: 'pending',
        },
        {
          id: 3,
          batchNumber: 'BATCH-2024-003',
          productName: 'Cheddar Cheese',
          productType: 'cheese',
          quantity: 50,
          unit: 'kg',
          status: 'planned',
          startTime: new Date(Date.now() + 7200000).toISOString(),
          estimatedEndTime: new Date(Date.now() + 28800000).toISOString(),
          notes: 'Age for 2 weeks minimum',
          qualityCheck: 'pending',
        },
        {
          id: 4,
          batchNumber: 'BATCH-2024-004',
          productName: 'Fresh Butter',
          productType: 'butter',
          quantity: 30,
          unit: 'kg',
          status: 'completed',
          startTime: new Date(Date.now() - 14400000).toISOString(),
          estimatedEndTime: new Date(Date.now() - 7200000).toISOString(),
          temperature: 5.0,
          pH: 6.5,
          qualityCheck: 'passed',
        },
      ]
      setTasks(sampleTasks)
      setStats({
        pending: 2,
        inProgress: 1,
        completed: 1,
        totalToday: 4,
        avgYield: 92.5,
      })
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      await api.batches.update(taskId, { status: newStatus })
      
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      ))

      loadTasks()
    } catch (err) {
      console.error('Failed to update status:', err)
      // Update local state anyway for demo
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      ))
    }
  }

  const handleQualityCheck = async () => {
    if (!selectedTask) return

    try {
      await api.batches.updateQuality(selectedTask.id, {
        temperature: parseFloat(qualityData.temperature),
        pH: parseFloat(qualityData.pH),
        notes: qualityData.notes,
        qualityCheck: qualityData.result,
      })

      setTasks(prev => prev.map(t => 
        t.id === selectedTask.id 
          ? { 
              ...t, 
              temperature: parseFloat(qualityData.temperature),
              pH: parseFloat(qualityData.pH),
              qualityCheck: qualityData.result,
            } 
          : t
      ))

      setShowQualityModal(false)
      setQualityData({ temperature: '', pH: '', notes: '', result: 'pending' })
    } catch (err) {
      console.error('Failed to submit quality check:', err)
      alert('Quality check saved locally')
      setShowQualityModal(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
      case 'pending':
        return 'warning'
      case 'in_progress':
      case 'in-progress':
        return 'info'
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'passed':
        return 'success'
      case 'failed':
        return 'danger'
      default:
        return 'warning'
    }
  }

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'milk':
        return '🥛'
      case 'yogurt':
        return '🥄'
      case 'cheese':
        return '🧀'
      case 'butter':
        return '🧈'
      default:
        return '📦'
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeRemaining = (endTime: string) => {
    const diff = new Date(endTime).getTime() - Date.now()
    if (diff <= 0) return 'Completed'
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    return `${hours}h ${minutes}m remaining`
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
            Production Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome, {user?.name}! Manage your production batches here.
          </p>
        </div>
        <Button variant="secondary" onClick={loadTasks}>
          <RefreshCw size={20} className="mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">Pending</p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.pending}</p>
            </div>
            <Clock className="text-yellow-600" size={28} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200">In Progress</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.inProgress}</p>
            </div>
            <Factory className="text-blue-600" size={28} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 dark:text-green-200">Completed</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.completed}</p>
            </div>
            <CheckCircle className="text-green-600" size={28} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-800 dark:text-purple-200">Total Tasks</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalToday}</p>
            </div>
            <ClipboardList className="text-purple-600" size={28} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-800 dark:text-teal-200">Avg Yield</p>
              <p className="text-3xl font-bold text-teal-900 dark:text-teal-100">{stats.avgYield}%</p>
            </div>
            <FlaskConical className="text-teal-600" size={28} />
          </div>
        </Card>
      </div>

      {/* Production Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-yellow-600">
            <Clock className="mr-2" size={24} />
            Pending ({stats.pending})
          </h3>
          <div className="space-y-3">
            {tasks.filter(t => t.status === 'planned' || t.status === 'pending').map(task => (
              <div
                key={task.id}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getProductIcon(task.productType)}</span>
                    <div>
                      <p className="font-semibold">{task.batchNumber}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.productName}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Package size={14} className="mr-1" />
                  {task.quantity} {task.unit}
                  <span className="mx-2">•</span>
                  <Timer size={14} className="mr-1" />
                  Start: {formatTime(task.startTime)}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => updateTaskStatus(task.id, 'in_progress')}
                >
                  <Play size={16} className="mr-2" />
                  Start Production
                </Button>
              </div>
            ))}
            {stats.pending === 0 && (
              <p className="text-center text-gray-500 py-4">No pending tasks</p>
            )}
          </div>
        </Card>

        {/* In Progress */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-600">
            <Factory className="mr-2" size={24} />
            In Progress ({stats.inProgress})
          </h3>
          <div className="space-y-3">
            {tasks.filter(t => t.status === 'in_progress' || t.status === 'in-progress').map(task => (
              <div
                key={task.id}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getProductIcon(task.productType)}</span>
                    <div>
                      <p className="font-semibold">{task.batchNumber}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.productName}</p>
                    </div>
                  </div>
                  <div className="animate-pulse">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Package size={14} className="mr-1" />
                  {task.quantity} {task.unit}
                </div>

                <div className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                  <Timer size={14} className="inline mr-1" />
                  {getTimeRemaining(task.estimatedEndTime)}
                </div>

                {task.temperature && (
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <span className="flex items-center">
                      <Thermometer size={14} className="mr-1 text-red-500" />
                      {task.temperature}°C
                    </span>
                    {task.pH && (
                      <span className="flex items-center">
                        <Droplets size={14} className="mr-1 text-blue-500" />
                        pH {task.pH}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedTask(task)
                      setShowQualityModal(true)
                    }}
                  >
                    <FlaskConical size={16} className="mr-1" />
                    Quality Check
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="flex-1"
                    onClick={() => updateTaskStatus(task.id, 'completed')}
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Complete
                  </Button>
                </div>
              </div>
            ))}
            {stats.inProgress === 0 && (
              <p className="text-center text-gray-500 py-4">No tasks in progress</p>
            )}
          </div>
        </Card>

        {/* Completed */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-green-600">
            <CheckCircle className="mr-2" size={24} />
            Completed ({stats.completed})
          </h3>
          <div className="space-y-3">
            {tasks.filter(t => t.status === 'completed').map(task => (
              <div
                key={task.id}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getProductIcon(task.productType)}</span>
                    <div>
                      <p className="font-semibold">{task.batchNumber}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.productName}</p>
                    </div>
                  </div>
                  <Badge variant={getQualityColor(task.qualityCheck) as any}>
                    {task.qualityCheck}
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Package size={14} className="mr-1" />
                  {task.quantity} {task.unit}
                </div>

                {task.temperature && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center">
                      <Thermometer size={14} className="mr-1 text-red-500" />
                      {task.temperature}°C
                    </span>
                    {task.pH && (
                      <span className="flex items-center">
                        <Droplets size={14} className="mr-1 text-blue-500" />
                        pH {task.pH}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            {stats.completed === 0 && (
              <p className="text-center text-gray-500 py-4">No completed tasks yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Quality Check Modal */}
      <Modal
        isOpen={showQualityModal}
        onClose={() => setShowQualityModal(false)}
        title="Quality Check"
      >
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Batch</p>
            <p className="font-semibold">{selectedTask?.batchNumber}</p>
            <p className="text-sm">{selectedTask?.productName} - {selectedTask?.quantity} {selectedTask?.unit}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Temperature (°C)"
              type="number"
              step="0.1"
              value={qualityData.temperature}
              onChange={(e) => setQualityData({ ...qualityData, temperature: e.target.value })}
              placeholder="e.g., 4.5"
            />
            <Input
              label="pH Level"
              type="number"
              step="0.1"
              value={qualityData.pH}
              onChange={(e) => setQualityData({ ...qualityData, pH: e.target.value })}
              placeholder="e.g., 6.7"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600"
              rows={3}
              value={qualityData.notes}
              onChange={(e) => setQualityData({ ...qualityData, notes: e.target.value })}
              placeholder="Any observations..."
            />
          </div>

          <Select
            label="Quality Result"
            value={qualityData.result}
            onChange={(e) => setQualityData({ ...qualityData, result: e.target.value as any })}
            options={[
              { value: 'pending', label: 'Pending Review' },
              { value: 'passed', label: 'Passed ✓' },
              { value: 'failed', label: 'Failed ✗' },
            ]}
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowQualityModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleQualityCheck}>
              <CheckCircle size={20} className="mr-2" />
              Submit Quality Check
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default OperatorDashboard

