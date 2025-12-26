import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Client from './Client';
import Order from './Order';
import User from './User';

@Table({
  tableName: 'invoices',
  timestamps: true,
})
export default class Invoice extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  invoiceNumber!: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  orderId?: number;

  @BelongsTo(() => Order)
  order?: Order;

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
  issueDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dueDate!: Date;

  @Column({
    type: DataType.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
    allowNull: true,
    defaultValue: 'draft',
  })
  status!: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  subtotal!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  tax?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  discount?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  total!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  amountPaid?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  balance!: number;

  @Column({
    type: DataType.ENUM('cash', 'bank_transfer', 'mobile_money', 'check', 'other'),
    allowNull: true,
  })
  paymentMethod?: 'cash' | 'bank_transfer' | 'mobile_money' | 'check' | 'other';

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
    this.addHook('beforeCreate', (invoice: Invoice) => {
      if (!invoice.invoiceNumber) {
        invoice.invoiceNumber = `INV-${Date.now()}`;
      }
    });
  }
}
