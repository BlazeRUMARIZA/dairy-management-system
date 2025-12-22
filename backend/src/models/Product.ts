import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  sku: string;
  barcode?: string;
  description?: string;
  currentStock: number;
  minThreshold: number;
  maxCapacity: number;
  unit: string;
  unitPrice: number;
  costPrice: number;
  location?: string;
  shelfLife?: number;
  storageTemp?: string;
  status: 'normal' | 'low' | 'critical' | 'out-of-stock';
  image?: string;
  supplier?: string;
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Cream', 'Other'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
    },
    barcode: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    currentStock: {
      type: Number,
      required: [true, 'Current stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    minThreshold: {
      type: Number,
      required: [true, 'Minimum threshold is required'],
      min: [0, 'Threshold cannot be negative'],
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Maximum capacity is required'],
      min: [0, 'Capacity cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['L', 'kg', 'units', 'g', 'ml'],
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Price cannot be negative'],
    },
    costPrice: {
      type: Number,
      required: [true, 'Cost price is required'],
      min: [0, 'Cost cannot be negative'],
    },
    location: {
      type: String,
      trim: true,
    },
    shelfLife: {
      type: Number,
      min: [0, 'Shelf life cannot be negative'],
    },
    storageTemp: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['normal', 'low', 'critical', 'out-of-stock'],
      default: 'normal',
    },
    image: {
      type: String,
    },
    supplier: {
      type: String,
      trim: true,
    },
    lastRestocked: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Update status based on stock levels
productSchema.pre('save', function (next) {
  if (this.currentStock === 0) {
    this.status = 'out-of-stock';
  } else if (this.currentStock < this.minThreshold * 0.5) {
    this.status = 'critical';
  } else if (this.currentStock < this.minThreshold) {
    this.status = 'low';
  } else {
    this.status = 'normal';
  }
  next();
});

export default mongoose.model<IProduct>('Product', productSchema);
