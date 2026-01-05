/**
 * Role-based permissions and access control
 */

export type UserRole = 'admin' | 'manager' | 'operator' | 'driver' | 'viewer';

export interface RolePermissions {
  canManageUsers: boolean;
  canManageProducts: boolean;
  canManageOrders: boolean;
  canManageClients: boolean;
  canManageProduction: boolean;
  canManageInvoices: boolean;
  canViewReports: boolean;
  canUpdateDeliveryStatus: boolean;
  canAccessSettings: boolean;
  canDeleteRecords: boolean;
  canExportData: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    canManageUsers: true,
    canManageProducts: true,
    canManageOrders: true,
    canManageClients: true,
    canManageProduction: true,
    canManageInvoices: true,
    canViewReports: true,
    canUpdateDeliveryStatus: true,
    canAccessSettings: true,
    canDeleteRecords: true,
    canExportData: true,
  },
  manager: {
    canManageUsers: false,
    canManageProducts: true,
    canManageOrders: true,
    canManageClients: true,
    canManageProduction: true,
    canManageInvoices: true,
    canViewReports: true,
    canUpdateDeliveryStatus: true,
    canAccessSettings: false,
    canDeleteRecords: false,
    canExportData: true,
  },
  operator: {
    canManageUsers: false,
    canManageProducts: false,
    canManageOrders: false,
    canManageClients: false,
    canManageProduction: true,
    canManageInvoices: false,
    canViewReports: false,
    canUpdateDeliveryStatus: false,
    canAccessSettings: false,
    canDeleteRecords: false,
    canExportData: false,
  },
  driver: {
    canManageUsers: false,
    canManageProducts: false,
    canManageOrders: false,
    canManageClients: false,
    canManageProduction: false,
    canManageInvoices: false,
    canViewReports: false,
    canUpdateDeliveryStatus: true,
    canAccessSettings: false,
    canDeleteRecords: false,
    canExportData: false,
  },
  viewer: {
    canManageUsers: false,
    canManageProducts: false,
    canManageOrders: false,
    canManageClients: false,
    canManageProduction: false,
    canManageInvoices: false,
    canViewReports: true,
    canUpdateDeliveryStatus: false,
    canAccessSettings: false,
    canDeleteRecords: false,
    canExportData: false,
  },
};

export const getRolePermissions = (role: string): RolePermissions => {
  return rolePermissions[role as UserRole] || rolePermissions.viewer;
};

export const getRoleDisplayName = (role: string): string => {
  const names: Record<string, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    operator: 'Production Operator',
    driver: 'Delivery Driver',
    viewer: 'Viewer',
  };
  return names[role] || 'User';
};

export const getRoleColor = (role: string): string => {
  const colors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    operator: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    driver: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };
  return colors[role] || colors.viewer;
};

// Navigation items based on role
export interface NavItem {
  icon: string;
  label: string;
  path: string;
}

export const getNavigationForRole = (role: string): { main: string[], secondary: string[] } => {
  const allRoutes = {
    dashboard: '/dashboard',
    production: '/production',
    inventory: '/inventory',
    orders: '/orders',
    clients: '/clients',
    invoicing: '/invoicing',
    reports: '/reports',
    settings: '/settings',
    deliveries: '/deliveries',
    'my-tasks': '/my-tasks',
  };

  switch (role) {
    case 'admin':
      return {
        main: ['dashboard', 'production', 'inventory', 'orders', 'clients', 'invoicing', 'reports'],
        secondary: ['settings'],
      };
    case 'manager':
      return {
        main: ['dashboard', 'production', 'inventory', 'orders', 'clients', 'invoicing', 'reports'],
        secondary: [],
      };
    case 'operator':
      return {
        main: ['dashboard', 'my-tasks', 'production', 'inventory'],
        secondary: [],
      };
    case 'driver':
      return {
        main: ['dashboard', 'deliveries'],
        secondary: [],
      };
    case 'viewer':
      return {
        main: ['dashboard', 'reports'],
        secondary: [],
      };
    default:
      return {
        main: ['dashboard'],
        secondary: [],
      };
  }
};

