// Data service for managing all CRUD operations
import batchesData from '../data/batches.json'
import clientsData from '../data/clients.json'
import ordersData from '../data/orders.json'
import productsData from '../data/products.json'

// Helper to get data from localStorage or fallback to JSON
const getStorageData = <T,>(key: string, defaultData: T): T => {
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error(`Error parsing ${key}:`, e)
    }
  }
  // Initialize localStorage with default data
  localStorage.setItem(key, JSON.stringify(defaultData))
  return defaultData
}

const saveStorageData = <T,>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data))
}

// Batch Service
export const batchService = {
  getAll: () => {
    const data = getStorageData('batches', batchesData)
    return data.batches
  },

  getById: (id: string) => {
    const batches = batchService.getAll()
    return batches.find(b => b.id === id)
  },

  create: (batch: any) => {
    const batches = batchService.getAll()
    const newBatch = {
      ...batch,
      id: `B-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }
    batches.push(newBatch)
    saveStorageData('batches', { batches })
    return newBatch
  },

  update: (id: string, updates: any) => {
    const batches = batchService.getAll()
    const index = batches.findIndex(b => b.id === id)
    if (index !== -1) {
      batches[index] = { ...batches[index], ...updates }
      saveStorageData('batches', { batches })
      return batches[index]
    }
    return null
  },

  delete: (id: string) => {
    const batches = batchService.getAll()
    const filtered = batches.filter(b => b.id !== id)
    saveStorageData('batches', { batches: filtered })
    return true
  }
}

// Client Service
export const clientService = {
  getAll: () => {
    const data = getStorageData('clients', clientsData)
    return data.clients
  },

  getById: (id: string) => {
    const clients = clientService.getAll()
    return clients.find(c => c.id === id)
  },

  create: (client: any) => {
    const clients = clientService.getAll()
    const newClient = {
      ...client,
      id: `CLI-${String(clients.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      totalOrders: 0,
      totalRevenue: 0,
      monthlyRevenue: 0
    }
    clients.push(newClient)
    saveStorageData('clients', { clients })
    return newClient
  },

  update: (id: string, updates: any) => {
    const clients = clientService.getAll()
    const index = clients.findIndex(c => c.id === id)
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updates }
      saveStorageData('clients', { clients })
      return clients[index]
    }
    return null
  },

  delete: (id: string) => {
    const clients = clientService.getAll()
    const filtered = clients.filter(c => c.id !== id)
    saveStorageData('clients', { clients: filtered })
    return true
  }
}

// Order Service
export const orderService = {
  getAll: () => {
    const data = getStorageData('orders', ordersData)
    return data.orders
  },

  getById: (id: string) => {
    const orders = orderService.getAll()
    return orders.find(o => o.id === id)
  },

  getByClientId: (clientId: string) => {
    const orders = orderService.getAll()
    return orders.filter(o => o.clientId === clientId)
  },

  create: (order: any) => {
    const orders = orderService.getAll()
    const orderNumber = String(orders.length + 1234).padStart(4, '0')
    const newOrder = {
      ...order,
      id: `ORD-${new Date().getFullYear()}-${orderNumber}`,
      orderNumber,
      status: 'pending',
      tracking: {
        status: 'pending',
        events: [
          {
            status: 'created',
            timestamp: new Date().toISOString(),
            note: 'Order created'
          }
        ]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    orders.push(newOrder)
    saveStorageData('orders', { orders })
    return newOrder
  },

  update: (id: string, updates: any) => {
    const orders = orderService.getAll()
    const index = orders.findIndex(o => o.id === id)
    if (index !== -1) {
      orders[index] = { 
        ...orders[index], 
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveStorageData('orders', { orders })
      return orders[index]
    }
    return null
  },

  updateStatus: (id: string, status: string, note: string = '') => {
    const order = orderService.getById(id)
    if (order) {
      const event = {
        status,
        timestamp: new Date().toISOString(),
        note: note || `Order status changed to ${status}`
      }
      order.tracking.events.push(event)
      order.tracking.status = status
      order.status = status
      return orderService.update(id, order)
    }
    return null
  },

  delete: (id: string) => {
    const orders = orderService.getAll()
    const filtered = orders.filter(o => o.id !== id)
    saveStorageData('orders', { orders: filtered })
    return true
  }
}

// Product Service
export const productService = {
  getAll: () => {
    const data = getStorageData('products', productsData)
    return data.products
  },

  getById: (id: string) => {
    const products = productService.getAll()
    return products.find(p => p.id === id)
  },

  getByCategory: (category: string) => {
    const products = productService.getAll()
    return products.filter(p => p.category === category)
  },

  getLowStock: () => {
    const products = productService.getAll()
    return products.filter(p => p.currentStock < p.minThreshold)
  },

  create: (product: any) => {
    const products = productService.getAll()
    const newProduct = {
      ...product,
      id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
      status: product.currentStock >= product.minThreshold ? 'normal' : 
              product.currentStock < product.minThreshold && product.currentStock > 0 ? 'low' : 'critical',
      lastRestocked: new Date().toISOString()
    }
    products.push(newProduct)
    saveStorageData('products', { products })
    return newProduct
  },

  update: (id: string, updates: any) => {
    const products = productService.getAll()
    const index = products.findIndex(p => p.id === id)
    if (index !== -1) {
      products[index] = { ...products[index], ...updates }
      // Update status based on stock
      const product = products[index]
      product.status = product.currentStock >= product.minThreshold ? 'normal' : 
                      product.currentStock < product.minThreshold && product.currentStock > 0 ? 'low' : 'critical'
      saveStorageData('products', { products })
      return products[index]
    }
    return null
  },

  updateStock: (id: string, quantity: number) => {
    const product = productService.getById(id)
    if (product) {
      const newStock = product.currentStock + quantity
      return productService.update(id, { 
        currentStock: newStock,
        lastRestocked: quantity > 0 ? new Date().toISOString() : product.lastRestocked
      })
    }
    return null
  },

  delete: (id: string) => {
    const products = productService.getAll()
    const filtered = products.filter(p => p.id !== id)
    saveStorageData('products', { products: filtered })
    return true
  }
}

// Report Service
export const reportService = {
  getProductionReport: (startDate: string, endDate: string) => {
    const batches = batchService.getAll()
    const filtered = batches.filter(b => {
      const batchDate = new Date(b.createdAt)
      return batchDate >= new Date(startDate) && batchDate <= new Date(endDate)
    })
    
    const totalQuantity = filtered.reduce((sum, b) => sum + b.quantity, 0)
    const completedBatches = filtered.filter(b => b.status === 'completed').length
    const inProgressBatches = filtered.filter(b => b.status === 'in-progress').length
    const pendingBatches = filtered.filter(b => b.status === 'pending').length
    
    const avgYield = filtered.length > 0 
      ? filtered.reduce((sum, b) => sum + (b.yield || 0), 0) / filtered.length 
      : 0
    
    // Group by product type for pie chart
    const byProductType = Object.entries(
      filtered.reduce((acc: any, b) => {
        const type = b.productType || 'other'
        if (!acc[type]) {
          acc[type] = { productType: type, quantity: 0, batches: 0 }
        }
        acc[type].quantity += b.quantity
        acc[type].batches += 1
        return acc
      }, {})
    ).map(([_, value]) => value)
    
    return {
      period: { startDate, endDate },
      totalBatches: filtered.length,
      totalQuantity,
      completedBatches,
      inProgressBatches,
      pendingBatches,
      averageYield: avgYield,
      byProductType
    }
  },

  getSalesReport: (startDate: string, endDate: string) => {
    const orders = orderService.getAll()
    const filtered = orders.filter(o => {
      const orderDate = new Date(o.createdAt)
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
    })
    
    const totalRevenue = filtered.reduce((sum, o) => sum + o.total, 0)
    const totalOrders = filtered.length
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    // Group by product for bar chart
    const productRevenue: any = {}
    filtered.forEach(order => {
      order.items.forEach((item: any) => {
        if (!productRevenue[item.productName]) {
          productRevenue[item.productName] = { productName: item.productName, revenue: 0, quantity: 0 }
        }
        productRevenue[item.productName].revenue += item.total
        productRevenue[item.productName].quantity += item.quantity
      })
    })
    
    const byProduct = Object.values(productRevenue)
    
    // Group by status
    const statusGroups: any = {}
    filtered.forEach(order => {
      if (!statusGroups[order.status]) {
        statusGroups[order.status] = { status: order.status, count: 0, revenue: 0 }
      }
      statusGroups[order.status].count += 1
      statusGroups[order.status].revenue += order.total
    })
    
    const byStatus = Object.values(statusGroups)
    
    return {
      period: { startDate, endDate },
      totalOrders,
      totalRevenue,
      averageOrderValue: avgOrderValue,
      byProduct,
      byStatus
    }
  },

  getClientReport: () => {
    const clients = clientService.getAll()
    const orders = orderService.getAll()
    
    const clientData = clients.map(client => {
      const clientOrders = orders.filter(o => o.clientId === client.id)
      const totalSpent = clientOrders.reduce((sum, o) => sum + o.total, 0)
      
      return {
        id: client.id,
        name: client.name,
        type: client.type,
        totalOrders: clientOrders.length,
        totalRevenue: totalSpent,
        monthlyRevenue: client.monthlyRevenue || 0,
        rating: client.rating || 5,
        lastOrderDate: clientOrders.length > 0 
          ? clientOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
          : null
      }
    }).sort((a, b) => b.totalRevenue - a.totalRevenue)
    
    return {
      totalClients: clients.length,
      activeClients: clients.filter(c => c.status === 'active').length,
      topClients: clientData.slice(0, 10)
    }
  },

  getInventoryReport: () => {
    const products = productService.getAll()
    
    const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0)
    const lowStock = productService.getLowStock()
    
    return {
      totalProducts: products.length,
      totalValue: totalValue,
      lowStockCount: lowStock.length,
      lowStockItems: lowStock.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        currentStock: p.currentStock,
        minThreshold: p.minThreshold,
        unit: p.unit,
        status: p.status
      })),
      byCategory: products.reduce((acc: any, p) => {
        if (!acc[p.category]) {
          acc[p.category] = { category: p.category, count: 0, value: 0 }
        }
        acc[p.category].count += 1
        acc[p.category].value += p.currentStock * p.unitPrice
        return acc
      }, {})
    }
  }
}
