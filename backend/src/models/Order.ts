import mongoose, { Document, Schema } from 'mongoose';

interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface IDeliveryAddress {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

interface ITrackingEvent {
  status: string;
  timestamp: Date;
  note?: string;
  location?: string;
  updatedBy?: mongoose.Types.ObjectId;
}

interface ITracking {
  status: string;
  events: ITrackingEvent[];
}

export interface IOrder extends Document {
  orderNumber: string;
  clientId: mongoose.Types.ObjectId;
  clientName: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in-transit' | 'delivered' | 'cancelled';
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  deliveryAddress: IDeliveryAddress;
  deliveryDate: Date;
  deliveryTime?: string;
  driverId?: mongoose.Types.ObjectId;
  driverName?: string;
  specialInstructions?: string;
  tracking: ITracking;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue';
  paymentMethod?: string;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client is required'],
    },
    clientName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'in-transit', 'delivered', 'cancelled'],
      default: 'pending',
    },
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
      unit: {
        type: String,
        required: true,
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
    }],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    deliveryTime: String,
    driverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    driverName: String,
    specialInstructions: String,
    tracking: {
      status: {
        type: String,
        default: 'pending',
      },
      events: [{
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
        location: String,
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      }],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'overdue'],
      default: 'pending',
    },
    paymentMethod: String,
    notes: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model<IOrder>('Order', orderSchema);
