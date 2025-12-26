import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import Client from './Client';
import User from './User';

@Table({
  tableName: 'orders',
  timestamps: true,
})
export default class Order extends Model {
  @Column({
    type: DataType.STRING(50),
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
    type: DataType.DATE,
    allowNull: false,
  })
  orderDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deliveryDate?: Date;

  @Column({
    type: DataType.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
    allowNull: true,
    defaultValue: 'pending',
  })
  status!: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

  @Column({
    type: DataType.ENUM('unpaid', 'partial', 'paid'),
    allowNull: true,
    defaultValue: 'unpaid',
  })
  paymentStatus!: 'unpaid' | 'partial' | 'paid';

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  total!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  discount?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  tax?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  grandTotal!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  createdBy?: number;

  @BelongsTo(() => User, 'createdBy')
  creator?: User;

  static initHooks() {
    this.addHook('beforeCreate', (order: Order) => {
      if (!order.orderNumber) {
        order.orderNumber = `ORD-${Date.now()}`;
      }
    });
  }
}
