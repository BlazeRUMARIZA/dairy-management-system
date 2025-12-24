import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Product from './Product';
import { User } from './User';

@Table({
  tableName: 'batches',
  timestamps: true,
})
export default class Batch extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  batchNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  product!: string;

  @Column({
    type: DataType.ENUM('milk', 'yogurt', 'cheese', 'butter', 'cream', 'other'),
    allowNull: false,
  })
  productType!: 'milk' | 'yogurt' | 'cheese' | 'butter' | 'cream' | 'other';

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  productId?: number;

  @BelongsTo(() => Product)
  productRef?: Product;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  quantity!: number;

  @Column({
    type: DataType.ENUM('L', 'kg', 'units'),
    allowNull: false,
  })
  unit!: 'L' | 'kg' | 'units';

  @Column({
    type: DataType.ENUM('pending', 'in-progress', 'completed', 'failed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status!: 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  operatorId!: number;

  @BelongsTo(() => User)
  operatorUser!: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  operator!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startTime!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endTime?: Date;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: -50,
      max: 150,
    },
  })
  temperature?: number;

  @Column({
    type: DataType.DECIMAL(4, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 14,
    },
  })
  pH?: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100,
    },
  })
  yield?: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: {
      temperature: 'pending',
      pH: 'pending',
      bacteria: 'pending',
    },
  })
  qualityChecks!: {
    temperature: 'pass' | 'fail' | 'pending';
    pH: 'pass' | 'fail' | 'pending';
    bacteria: 'pass' | 'fail' | 'pending';
    appearance?: 'pass' | 'fail' | 'pending';
    taste?: 'pass' | 'fail' | 'pending';
  };

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: [],
  })
  ingredients?: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: [],
  })
  equipment?: string[];

  // Initialize hooks
  static initHooks() {
    this.addHook('beforeCreate', async (instance: Batch) => {
      if (!instance.batchNumber) {
        const year = new Date().getFullYear();
        const count = await Batch.count();
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        instance.batchNumber = `B-${year}-${random}${String(count + 1).padStart(3, '0')}`;
      }
    });
  }
}

