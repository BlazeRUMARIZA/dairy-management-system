import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import Client from './Client';
import { User } from './User';
import Invoice from './Invoice';

@Table({
  tableName: 'orders',
  timestamps: true,
})
export default class Order extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  orderNumber!: string;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  clientId!: number;

  @BelongsTo(() => Client)
  client!: Client;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  clientName!: string;

  @Column({
    type: DataType.ENUM('pending', 'confirmed', 'preparing', 'ready', 'in-transit', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status!: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in-transit' | 'delivered' | 'cancelled';

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  items!: Array<{
    productId: number;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
  }>;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  subtotal!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  tax!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  discount?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  total!: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  deliveryAddress!: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  deliveryDate!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  deliveryTime?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  driverId?: number;

  @BelongsTo(() => User, 'driverId')
  driver?: User;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  driverName?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  specialInstructions?: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: {
      status: 'pending',
      events: []
    },
  })
  tracking!: {
    status: string;
    events: Array<{
      status: string;
      timestamp: Date;
      note?: string;
      location?: string;
      updatedBy?: number;
    }>;
  };

  @Column({
    type: DataType.ENUM('pending', 'paid', 'partial', 'overdue'),
    allowNull: false,
    defaultValue: 'pending',
  })
  paymentStatus!: 'pending' | 'paid' | 'partial' | 'overdue';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  paymentMethod?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdBy!: number;

  @BelongsTo(() => User, 'createdBy')
  creator!: User;

  @HasOne(() => Invoice)
  invoice!: Invoice;

  // Initialize hooks
  static initHooks() {
    this.addHook('beforeCreate', async (instance: Order) => {
      if (!instance.orderNumber) {
        const year = new Date().getFullYear();
        const count = await Order.count();
        instance.orderNumber = `ORD-${year}-${String(count + 1).padStart(4, '0')}`;
      }
    });
  }
}
