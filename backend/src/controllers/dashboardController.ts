import { Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Client from '../models/Client';
import Batch from '../models/Batch';
import Invoice from '../models/Invoice';
import { AuthRequest } from '../middleware/auth';

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // Total products
    const totalProducts = await Product.countDocuments();

    // Low stock products
    const lowStockProducts = await Product.countDocuments({
      status: { $in: ['low', 'critical', 'out-of-stock'] },
    });

    // Orders statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    // Revenue statistics
    const monthlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: thisMonth }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const todayRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: today }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    // Active clients
    const activeClients = await Client.countDocuments({ status: 'active' });

    // Active batches
    const activeBatches = await Batch.countDocuments({ status: 'in-progress' });

    res.status(200).json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          lowStock: lowStockProducts,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          today: todayOrders,
        },
        revenue: {
          monthly: monthlyRevenue[0]?.total || 0,
          today: todayRevenue[0]?.total || 0,
        },
        clients: {
          active: activeClients,
        },
        production: {
          activeBatches,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get sales report
// @route   GET /api/v1/reports/sales
// @access  Private
export const getSalesReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    let matchStage: any = { status: { $ne: 'cancelled' } };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate as string);
      }
    }

    let groupStage: any = {};
    
    if (groupBy === 'day') {
      groupStage = {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      };
    } else if (groupBy === 'month') {
      groupStage = {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      };
    } else if (groupBy === 'year') {
      groupStage = {
        $group: {
          _id: { year: { $year: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      };
    }

    const salesData = await Order.aggregate([
      { $match: matchStage },
      groupStage,
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    res.status(200).json({
      success: true,
      count: salesData.length,
      data: salesData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get production report
// @route   GET /api/v1/reports/production
// @access  Private
export const getProductionReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, productType } = req.query;

    let matchStage: any = { status: 'completed' };

    if (startDate || endDate) {
      matchStage.startTime = {};
      if (startDate) {
        matchStage.startTime.$gte = new Date(startDate as string);
      }
      if (endDate) {
        matchStage.startTime.$lte = new Date(endDate as string);
      }
    }

    if (productType) {
      matchStage.productType = productType;
    }

    const productionData = await Batch.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$productType',
          totalBatches: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          avgYield: { $avg: '$yield' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: productionData.length,
      data: productionData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get inventory report
// @route   GET /api/v1/reports/inventory
// @access  Private
export const getInventoryReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const inventoryData = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$currentStock' },
          totalValue: { $sum: { $multiply: ['$currentStock', '$unitPrice'] } },
          lowStockCount: {
            $sum: {
              $cond: [{ $in: ['$status', ['low', 'critical', 'out-of-stock']] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      count: inventoryData.length,
      data: inventoryData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get client report
// @route   GET /api/v1/reports/clients
// @access  Private
export const getClientReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const clientData = await Client.aggregate([
      {
        $group: {
          _id: '$type',
          totalClients: { $sum: 1 },
          activeClients: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
          },
          totalRevenue: { $sum: '$totalRevenue' },
          avgRating: { $avg: '$rating' },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    // Top clients by revenue
    const topClients = await Client.find()
      .select('name type totalRevenue totalOrders rating')
      .sort({ totalRevenue: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        byType: clientData,
        topClients,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get financial report
// @route   GET /api/v1/reports/financial
// @access  Private (Admin, Manager)
export const getFinancialReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    let matchStage: any = {};

    if (startDate || endDate) {
      matchStage.issueDate = {};
      if (startDate) {
        matchStage.issueDate.$gte = new Date(startDate as string);
      }
      if (endDate) {
        matchStage.issueDate.$lte = new Date(endDate as string);
      }
    }

    const financialData = await Invoice.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$total' },
        },
      },
    ]);

    // Monthly revenue trend
    const monthlyTrend = await Invoice.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$issueDate' },
            month: { $month: '$issueDate' },
          },
          revenue: { $sum: '$total' },
          invoices: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        byStatus: financialData,
        monthlyTrend,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
