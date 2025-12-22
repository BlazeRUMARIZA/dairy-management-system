import mongoose, { Document, Schema } from 'mongoose';

interface IContact {
  name: string;
  position?: string;
  email?: string;
  phone?: string;
}

interface IAddress {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

interface IPreferences {
  deliveryDays?: string[];
  paymentTerms?: number;
  deliveryTime?: string;
}

export interface IClient extends Document {
  name: string;
  type: 'Restaurant' | 'Grocery' | 'Hotel' | 'Cafe' | 'Retail' | 'Wholesaler' | 'Other';
  email: string;
  phone: string;
  address: string;
  contact?: IContact;
  billingAddress?: IAddress;
  deliveryAddress?: IAddress;
  status: 'active' | 'inactive' | 'suspended';
  rating?: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  preferences?: IPreferences;
  favoriteProducts?: string[];
  lastOrderDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Client type is required'],
      enum: ['Restaurant', 'Grocery', 'Hotel', 'Cafe', 'Retail', 'Wholesaler', 'Other'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    contact: {
      name: String,
      position: String,
      email: String,
      phone: String,
    },
    billingAddress: {
      street: String,
      city: String,
      zipCode: String,
      country: String,
    },
    deliveryAddress: {
      street: String,
      city: String,
      zipCode: String,
      country: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    monthlyRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    preferences: {
      deliveryDays: [String],
      paymentTerms: Number,
      deliveryTime: String,
    },
    favoriteProducts: [String],
    lastOrderDate: Date,
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
clientSchema.index({ name: 'text', email: 'text' });

export default mongoose.model<IClient>('Client', clientSchema);
