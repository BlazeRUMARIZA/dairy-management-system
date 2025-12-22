import mongoose, { Document, Schema } from 'mongoose';

interface IQualityChecks {
  temperature: 'pass' | 'fail' | 'pending';
  pH: 'pass' | 'fail' | 'pending';
  bacteria: 'pass' | 'fail' | 'pending';
  appearance?: 'pass' | 'fail' | 'pending';
  taste?: 'pass' | 'fail' | 'pending';
}

export interface IBatch extends Document {
  batchNumber: string;
  product: string;
  productType: 'milk' | 'yogurt' | 'cheese' | 'butter' | 'cream' | 'other';
  productId?: mongoose.Types.ObjectId;
  quantity: number;
  unit: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
  operatorId: mongoose.Types.ObjectId;
  operator: string;
  startTime: Date;
  endTime?: Date;
  temperature?: number;
  pH?: number;
  yield?: number;
  qualityChecks: IQualityChecks;
  notes?: string;
  ingredients?: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  equipment?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const batchSchema = new Schema<IBatch>(
  {
    batchNumber: {
      type: String,
      required: true,
      unique: true,
    },
    product: {
      type: String,
      required: [true, 'Product name is required'],
    },
    productType: {
      type: String,
      required: [true, 'Product type is required'],
      enum: ['milk', 'yogurt', 'cheese', 'butter', 'cream', 'other'],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['L', 'kg', 'units'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Operator is required'],
    },
    operator: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: Date,
    temperature: {
      type: Number,
      min: -50,
      max: 150,
    },
    pH: {
      type: Number,
      min: 0,
      max: 14,
    },
    yield: {
      type: Number,
      min: 0,
      max: 100,
    },
    qualityChecks: {
      temperature: {
        type: String,
        enum: ['pass', 'fail', 'pending'],
        default: 'pending',
      },
      pH: {
        type: String,
        enum: ['pass', 'fail', 'pending'],
        default: 'pending',
      },
      bacteria: {
        type: String,
        enum: ['pass', 'fail', 'pending'],
        default: 'pending',
      },
      appearance: {
        type: String,
        enum: ['pass', 'fail', 'pending'],
      },
      taste: {
        type: String,
        enum: ['pass', 'fail', 'pending'],
      },
    },
    notes: String,
    ingredients: [{
      name: {
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
    }],
    equipment: [String],
  },
  {
    timestamps: true,
  }
);

// Generate batch number
batchSchema.pre('save', async function (next) {
  if (!this.batchNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Batch').countDocuments();
    this.batchNumber = `B-${year}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

export default mongoose.model<IBatch>('Batch', batchSchema);
