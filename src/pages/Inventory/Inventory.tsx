import React, { useState, useEffect } from 'react'
import { Card } from '../../components/UI/Card'
import { Badge } from '../../components/UI/Badge'
import { Button } from '../../components/UI/Button'
import { Modal } from '../../components/UI/Modal'
import { Input, Select } from '../../components/UI/Input'
import { Package, AlertTriangle, Search, Plus, Edit, Trash2, Eye, TrendingDown, TrendingUp } from 'lucide-react'
import { productService } from '../../services/dataService'
import { format } from 'date-fns'

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showProductModal, setShowProductModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [stockOperation, setStockOperation] = useState<'add' | 'remove'>('add')
  const [stockQuantity, setStockQuantity] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    category: 'milk',
    sku: '',
    barcode: '',
    description: '',
    currentStock: '',
    minThreshold: '',
    maxCapacity: '',
    unit: 'L',
    unitPrice: '',
    costPrice: '',
    location: '',
    shelfLife: '',
    storageTemp: '',
    supplier: ''
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const data = productService.getAll()
    setProducts(data)
  }

  const handleCreate = () => {
    setEditMode(false)
    setFormData({
      name: '',
      category: 'milk',
      sku: '',
      barcode: '',
      description: '',
      currentStock: '',
      minThreshold: '',
      maxCapacity: '',
      unit: 'L',
      unitPrice: '',
      costPrice: '',
      location: '',
      shelfLife: '',
      storageTemp: '',
      supplier: ''
    })
    setShowProductModal(true)
  }

  const handleEdit = (product: any) => {
    setEditMode(true)
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      sku: product.sku,
      barcode: product.barcode || '',
      description: product.description,
      currentStock: product.currentStock.toString(),
      minThreshold: product.minThreshold.toString(),
      maxCapacity: product.maxCapacity.toString(),
      unit: product.unit,
      unitPrice: product.unitPrice.toString(),
      costPrice: product.costPrice.toString(),
      location: product.location,
      shelfLife: product.shelfLife.toString(),
      storageTemp: product.storageTemp,
      supplier: product.supplier
    })
    setShowProductModal(true)
  }

  const handleView = (product: any) => {
    setSelectedProduct(product)
    setShowDetailModal(true)
  }

  const handleStockUpdate = (product: any, operation: 'add' | 'remove') => {
    setSelectedProduct(product)
    setStockOperation(operation)
    setStockQuantity('')
    setShowStockModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      productService.delete(id)
      loadProducts()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData = {
      name: formData.name,
      category: formData.category,
      sku: formData.sku,
      barcode: formData.barcode,
      description: formData.description,
      currentStock: parseFloat(formData.currentStock),
      minThreshold: parseFloat(formData.minThreshold),
      maxCapacity: parseFloat(formData.maxCapacity),
      unit: formData.unit,
      unitPrice: parseFloat(formData.unitPrice),
      costPrice: parseFloat(formData.costPrice),
      location: formData.location,
      shelfLife: parseInt(formData.shelfLife),
      storageTemp: formData.storageTemp,
      supplier: formData.supplier,
      image: '/placeholder-product.jpg'
    }

    if (editMode && selectedProduct) {
      productService.update(selectedProduct.id, productData)
    } else {
      productService.create(productData)
    }

    loadProducts()
    setShowProductModal(false)
  }

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !stockQuantity) return

    const quantity = parseFloat(stockQuantity)
    const change = stockOperation === 'add' ? quantity : -quantity

    productService.updateStock(selectedProduct.id, change)
    loadProducts()
    setShowStockModal(false)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      normal: 'success',
      low: 'warning',
      critical: 'danger'
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'all' || 
                          (filter === 'low' && p.status !== 'normal') ||
                          p.category === filter
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const lowStockProducts = productService.getLowStock()
  const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage product stock levels</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
            </div>
            <Package className="text-primary-500" size={40} />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock Alert</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {lowStockProducts.length}
              </p>
            </div>
            <AlertTriangle className="text-warning-500" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Stock Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                €{totalValue.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="text-success-500" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(products.map(p => p.category)).size}
              </p>
            </div>
            <Package className="text-info-500" size={40} />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Products' },
              { value: 'low', label: 'Low Stock' },
              { value: 'milk', label: 'Milk' },
              { value: 'yogurt', label: 'Yogurt' },
              { value: 'cheese', label: 'Cheese' },
              { value: 'cream', label: 'Cream' }
            ]}
          />
        </div>
      </Card>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="text-warning-500" size={24} />
            <h3 className="text-lg font-semibold text-warning-700 dark:text-warning-400">
              Low Stock Alert ({lowStockProducts.length} items)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.slice(0, 6).map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Stock: {product.currentStock} / Min: {product.minThreshold} {product.unit}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleStockUpdate(product, 'add')}
                >
                  Restock
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Products ({filteredProducts.length})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span>{product.currentStock} {product.unit}</span>
                      {product.status !== 'normal' && (
                        <AlertTriangle size={16} className="text-warning-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {product.minThreshold} {product.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    €{product.unitPrice.toFixed(2)}/{product.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleStockUpdate(product, 'add')}
                      >
                        <TrendingUp size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleStockUpdate(product, 'remove')}
                      >
                        <TrendingDown size={16} />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleView(product)}>
                        <Eye size={16} />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(product)}>
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)}>
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
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        title={editMode ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'milk', label: 'Milk' },
                { value: 'yogurt', label: 'Yogurt' },
                { value: 'cheese', label: 'Cheese' },
                { value: 'cream', label: 'Cream' }
              ]}
            />
            <Select
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              options={[
                { value: 'L', label: 'Liters (L)' },
                { value: 'kg', label: 'Kilograms (kg)' },
                { value: 'units', label: 'Units' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
            />
            <Input
              label="Barcode"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            />
          </div>

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Current Stock"
              type="number"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              required
              min="0"
            />
            <Input
              label="Min Threshold"
              type="number"
              value={formData.minThreshold}
              onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
              required
              min="0"
            />
            <Input
              label="Max Capacity"
              type="number"
              value={formData.maxCapacity}
              onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
              required
              min="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Unit Price (€)"
              type="number"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              required
              min="0"
            />
            <Input
              label="Cost Price (€)"
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              required
              min="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Refrigerator 1"
            />
            <Input
              label="Supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Shelf Life (days)"
              type="number"
              value={formData.shelfLife}
              onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
              min="1"
            />
            <Input
              label="Storage Temp"
              value={formData.storageTemp}
              onChange={(e) => setFormData({ ...formData, storageTemp: e.target.value })}
              placeholder="e.g., 2-4°C"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editMode ? 'Update Product' : 'Add Product'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowProductModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Stock Update Modal */}
      <Modal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        title={stockOperation === 'add' ? 'Add Stock' : 'Remove Stock'}
      >
        {selectedProduct && (
          <form onSubmit={handleStockSubmit} className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Product</p>
              <p className="font-semibold text-lg">{selectedProduct.name}</p>
              <p className="text-sm text-gray-600 mt-2">
                Current Stock: <span className="font-medium">{selectedProduct.currentStock} {selectedProduct.unit}</span>
              </p>
            </div>

            <Input
              label={`Quantity to ${stockOperation === 'add' ? 'Add' : 'Remove'} (${selectedProduct.unit})`}
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
              min="1"
              step="0.1"
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
              <p className="text-sm font-medium">
                New Stock Level:{' '}
                <span className="text-primary-600">
                  {stockOperation === 'add'
                    ? selectedProduct.currentStock + parseFloat(stockQuantity || '0')
                    : selectedProduct.currentStock - parseFloat(stockQuantity || '0')
                  }{' '}
                  {selectedProduct.unit}
                </span>
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" variant={stockOperation === 'add' ? 'success' : 'danger'} className="flex-1">
                {stockOperation === 'add' ? 'Add Stock' : 'Remove Stock'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowStockModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Product Details"
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Product Name</p>
                <p className="font-semibold">{selectedProduct.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold capitalize">{selectedProduct.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">SKU</p>
                <p className="font-semibold font-mono">{selectedProduct.sku}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Barcode</p>
                <p className="font-semibold font-mono">{selectedProduct.barcode || 'N/A'}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Stock Information</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                  <p className="text-sm text-gray-600">Current Stock</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedProduct.currentStock} {selectedProduct.unit}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                  <p className="text-sm text-gray-600">Min Threshold</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {selectedProduct.minThreshold} {selectedProduct.unit}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <p className="text-sm text-gray-600">Max Capacity</p>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedProduct.maxCapacity} {selectedProduct.unit}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Pricing</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Unit Price</p>
                  <p className="text-lg font-bold text-green-600">
                    €{selectedProduct.unitPrice.toFixed(2)}/{selectedProduct.unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cost Price</p>
                  <p className="text-lg font-bold">
                    €{selectedProduct.costPrice.toFixed(2)}/{selectedProduct.unit}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Storage & Location</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{selectedProduct.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage Temperature:</span>
                  <span className="font-medium">{selectedProduct.storageTemp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shelf Life:</span>
                  <span className="font-medium">{selectedProduct.shelfLife} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Supplier:</span>
                  <span className="font-medium">{selectedProduct.supplier}</span>
                </div>
              </div>
            </div>

            {selectedProduct.lastRestocked && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <p className="text-sm text-gray-600">Last Restocked:</p>
                <p className="font-medium">
                  {format(new Date(selectedProduct.lastRestocked), 'PPP')}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Inventory
