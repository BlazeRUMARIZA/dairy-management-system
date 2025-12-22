import { Response } from 'express';
import Order from '../models/Order';
import Client from '../models/Client';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private
export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, clientId, startDate, endDate } = req.query;
    
    let query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (clientId) {
      query.clientId = clientId;
    }
    
    if (startDate || endDate) {
      query.deliveryDate = {};
      if (startDate) {
        query.deliveryDate.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.deliveryDate.$lte = new Date(endDate as string);
      }
    }

    const orders = await Order.find(query)
      .populate('clientId', 'name type')
      .populate('items.productId', 'name')
      .populate('driverId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('clientId')
      .populate('items.productId')
      .populate('driverId')
      .populate('tracking.events.updatedBy', 'name');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create order
// @route   POST /api/v1/orders
// @access  Private (Admin, Manager)
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId, items, deliveryAddress, deliveryDate, deliveryTime, specialInstructions } = req.body;

    // Verify client exists
    const client = await Client.findById(clientId);
    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Client not found',
      });
      return;
    }

    // Calculate totals and verify products
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
        return;
      }

      if (product.currentStock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
        return;
      }

      const itemTotal = product.unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        unit: product.unit,
        unitPrice: product.unitPrice,
        total: itemTotal,
      });
    }

    // Calculate tax and total
    const tax = subtotal * 0.2; // 20% tax
    const total = subtotal + tax;

    // Create order
    const order = await Order.create({
      clientId,
      clientName: client.name,
      items: orderItems,
      subtotal,
      tax,
      total,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      specialInstructions,
      createdBy: req.user?._id,
      tracking: {
        status: 'pending',
        events: [{
          status: 'pending',
          timestamp: new Date(),
          note: 'Order created',
          updatedBy: req.user?._id,
        }],
      },
    });

    // Update product stocks
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { currentStock: -item.quantity },
      });
    }

    // Update client stats
    await Client.findByIdAndUpdate(clientId, {
      $inc: { totalOrders: 1, totalRevenue: total },
      lastOrderDate: new Date(),
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update order
// @route   PUT /api/v1/orders/:id
// @access  Private (Admin, Manager)
export const updateOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/v1/orders/:id/status
// @access  Private
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, note, location } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    order.status = status;
    order.tracking.status = status;
    order.tracking.events.push({
      status,
      timestamp: new Date(),
      note,
      location,
      updatedBy: req.user?._id,
    });

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Assign driver to order
// @route   PATCH /api/v1/orders/:id/assign-driver
// @access  Private (Admin, Manager)
export const assignDriver = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { driverId, driverName } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { driverId, driverName },
      { new: true }
    );

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Cancel order
// @route   PATCH /api/v1/orders/:id/cancel
// @access  Private (Admin, Manager)
export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    if (order.status === 'delivered') {
      res.status(400).json({
        success: false,
        message: 'Cannot cancel delivered order',
      });
      return;
    }

    order.status = 'cancelled';
    order.tracking.status = 'cancelled';
    order.tracking.events.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: req.body.reason || 'Order cancelled',
      updatedBy: req.user?._id,
    });

    await order.save();

    // Restore product stocks
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { currentStock: item.quantity },
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
