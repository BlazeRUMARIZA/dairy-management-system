/**
 * API Configuration
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Get authentication token from localStorage
 */
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Set authentication token in localStorage
 */
const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Remove authentication token from localStorage
 */
const removeToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Get user data from localStorage
 */
const getUser = (): any => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Set user data in localStorage
 */
const setUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Remove user data from localStorage
 */
const removeUser = (): void => {
  localStorage.removeItem('user');
};

/**
 * Generic API request handler
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

const request = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { method = 'GET', body, headers = {}, requiresAuth = true } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // Add authentication token if required
  if (requiresAuth) {
    const token = getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        removeToken();
        removeUser();
        window.location.href = '/login';
      }

      throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
  } catch (error: any) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: { email, password },
      requiresAuth: false,
    });

    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  },

  /**
   * Register new user
   */
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: userData,
      requiresAuth: false,
    });

    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    return request('/auth/me');
  },

  /**
   * Logout user
   */
  logout: () => {
    removeToken();
    removeUser();
    window.location.href = '/login';
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string) => {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: { email },
      requiresAuth: false,
    });
  },

  /**
   * Reset password
   */
  resetPassword: async (token: string, password: string) => {
    return request(`/auth/reset-password/${token}`, {
      method: 'PUT',
      body: { password },
      requiresAuth: false,
    });
  },

  /**
   * Update password
   */
  updatePassword: async (currentPassword: string, newPassword: string) => {
    return request('/auth/update-password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    });
  },
};

/**
 * Products API
 */
export const productsApi = {
  /**
   * Get all products
   */
  getAll: async (params?: { search?: string; category?: string; status?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return request(`/products${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Get product by ID
   */
  getById: async (id: string | number) => {
    return request(`/products/${id}`);
  },

  /**
   * Create product
   */
  create: async (productData: any) => {
    return request('/products', {
      method: 'POST',
      body: productData,
    });
  },

  /**
   * Update product
   */
  update: async (id: string | number, productData: any) => {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
  },

  /**
   * Delete product
   */
  delete: async (id: string | number) => {
    return request(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Update product stock
   */
  updateStock: async (id: string | number, quantity: number, type: 'add' | 'remove') => {
    return request(`/products/${id}/stock`, {
      method: 'PATCH',
      body: { quantity, type },
    });
  },

  /**
   * Get low stock products
   */
  getLowStock: async () => {
    return request('/products/low-stock');
  },

  /**
   * Get product statistics
   */
  getStats: async () => {
    return request('/products/stats');
  },
};

/**
 * Clients API
 */
export const clientsApi = {
  /**
   * Get all clients
   */
  getAll: async (params?: { search?: string; type?: string; status?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return request(`/clients${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Get client by ID
   */
  getById: async (id: string | number) => {
    return request(`/clients/${id}`);
  },

  /**
   * Create client
   */
  create: async (clientData: any) => {
    return request('/clients', {
      method: 'POST',
      body: clientData,
    });
  },

  /**
   * Update client
   */
  update: async (id: string | number, clientData: any) => {
    return request(`/clients/${id}`, {
      method: 'PUT',
      body: clientData,
    });
  },

  /**
   * Delete client
   */
  delete: async (id: string | number) => {
    return request(`/clients/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get client statistics
   */
  getStats: async (id: string | number) => {
    return request(`/clients/${id}/stats`);
  },
};

/**
 * Orders API
 */
export const ordersApi = {
  /**
   * Get all orders
   */
  getAll: async (params?: { status?: string; clientId?: string; startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return request(`/orders${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Get order by ID
   */
  getById: async (id: string | number) => {
    return request(`/orders/${id}`);
  },

  /**
   * Create order
   */
  create: async (orderData: any) => {
    return request('/orders', {
      method: 'POST',
      body: orderData,
    });
  },

  /**
   * Update order
   */
  update: async (id: string | number, orderData: any) => {
    return request(`/orders/${id}`, {
      method: 'PUT',
      body: orderData,
    });
  },

  /**
   * Delete order
   */
  delete: async (id: string | number) => {
    return request(`/orders/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Update order status
   */
  updateStatus: async (id: string | number, status: string) => {
    return request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },

  /**
   * Assign driver to order
   */
  assignDriver: async (id: string | number, driverId: string | number) => {
    return request(`/orders/${id}/driver`, {
      method: 'PATCH',
      body: { driverId },
    });
  },

  /**
   * Get order statistics
   */
  getStats: async () => {
    return request('/orders/stats');
  },

  /**
   * Track order
   */
  track: async (id: string | number) => {
    return request(`/orders/${id}/track`);
  },
};

/**
 * Batches API
 */
export const batchesApi = {
  /**
   * Get all batches
   */
  getAll: async (params?: { status?: string; productId?: string; startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return request(`/batches${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Get batch by ID
   */
  getById: async (id: string | number) => {
    return request(`/batches/${id}`);
  },

  /**
   * Create batch
   */
  create: async (batchData: any) => {
    return request('/batches', {
      method: 'POST',
      body: batchData,
    });
  },

  /**
   * Update batch
   */
  update: async (id: string | number, batchData: any) => {
    return request(`/batches/${id}`, {
      method: 'PUT',
      body: batchData,
    });
  },

  /**
   * Delete batch
   */
  delete: async (id: string | number) => {
    return request(`/batches/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Complete batch
   */
  complete: async (id: string | number, completionData: any) => {
    return request(`/batches/${id}/complete`, {
      method: 'PATCH',
      body: completionData,
    });
  },

  /**
   * Update quality checks
   */
  updateQuality: async (id: string | number, qualityData: any) => {
    return request(`/batches/${id}/quality`, {
      method: 'PATCH',
      body: qualityData,
    });
  },

  /**
   * Get batch statistics
   */
  getStats: async () => {
    return request('/batches/stats');
  },
};

/**
 * Invoices API
 */
export const invoicesApi = {
  /**
   * Get all invoices
   */
  getAll: async (params?: { status?: string; clientId?: string; startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return request(`/invoices${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Get invoice by ID
   */
  getById: async (id: string | number) => {
    return request(`/invoices/${id}`);
  },

  /**
   * Create invoice
   */
  create: async (invoiceData: any) => {
    return request('/invoices', {
      method: 'POST',
      body: invoiceData,
    });
  },

  /**
   * Create invoice from order
   */
  createFromOrder: async (orderId: string | number) => {
    return request(`/invoices/from-order/${orderId}`, {
      method: 'POST',
    });
  },

  /**
   * Update invoice
   */
  update: async (id: string | number, invoiceData: any) => {
    return request(`/invoices/${id}`, {
      method: 'PUT',
      body: invoiceData,
    });
  },

  /**
   * Delete invoice
   */
  delete: async (id: string | number) => {
    return request(`/invoices/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Record payment
   */
  recordPayment: async (id: string | number, paymentData: any) => {
    return request(`/invoices/${id}/payment`, {
      method: 'PATCH',
      body: paymentData,
    });
  },

  /**
   * Update invoice status
   */
  updateStatus: async (id: string | number, status: string) => {
    return request(`/invoices/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },

  /**
   * Get financial summary
   */
  getSummary: async () => {
    return request('/invoices/summary');
  },
};

/**
 * Dashboard API
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    return request('/dashboard/stats');
  },
};

/**
 * Reports API
 */
export const reportsApi = {
  /**
   * Get sales report
   */
  getSales: async (params?: { startDate?: string; endDate?: string; groupBy?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return request(`/reports/sales${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Get production report
   */
  getProduction: async (params?: { startDate?: string; endDate?: string; productType?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return request(`/reports/production${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * Get inventory report
   */
  getInventory: async () => {
    return request('/reports/inventory');
  },

  /**
   * Get client report
   */
  getClients: async () => {
    return request('/reports/clients');
  },

  /**
   * Get financial report
   */
  getFinancial: async (params?: { startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return request(`/reports/financial${queryParams ? `?${queryParams}` : ''}`);
  },
};

/**
 * Export all APIs
 */
export const api = {
  auth: authApi,
  products: productsApi,
  clients: clientsApi,
  orders: ordersApi,
  batches: batchesApi,
  invoices: invoicesApi,
  dashboard: dashboardApi,
  reports: reportsApi,
};

export default api;
