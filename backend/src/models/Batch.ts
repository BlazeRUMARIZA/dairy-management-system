import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Product from './Product';
import User from './User';

@Table({
  tableName: 'batches',
  timestamps: true,
})
export default class Batch extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  batchNumber!: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId!: number;

  @BelongsTo(() => Product)
  productRef!: Product;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.ENUM('liters', 'kg', 'pieces'),
    allowNull: true,
    defaultValue: 'liters',
  })
  unit!: 'liters' | 'kg' | 'pieces';

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
    type: DataType.ENUM('planned', 'in_progress', 'completed', 'cancelled'),
    allowNull: true,
    defaultValue: 'planned',
  })
  status!: 'planned' | 'in_progress' | 'completed' | 'cancelled';

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  cost?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiryDate?: Date;

  @Column({
    type: DataType.ENUM('pending', 'passed', 'failed'),
    allowNull: true,
    defaultValue: 'pending',
  })
  qualityCheck!: 'pending' | 'passed' | 'failed';

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  producedBy?: number;

  @BelongsTo(() => User, 'producedBy')
  producer?: User;

  static initHooks() {
    this.addHook('beforeCreate', (batch: Batch) => {
      if (!batch.batchNumber) {
        batch.batchNumber = `BCH-${Date.now()}`;
      }
    });
  }
}
