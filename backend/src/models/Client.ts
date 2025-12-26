import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  Index,
} from 'sequelize-typescript';
import Order from './Order';
import Invoice from './Invoice';

@Table({
  tableName: 'clients',
  timestamps: true,
  indexes: [
    {
      type: 'FULLTEXT',
      fields: ['name', 'email']
    }
  ]
})
export default class Client extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Index
  name!: string;

  @Column({
    type: DataType.ENUM('retail', 'wholesale', 'distributor'),
    allowNull: true,
    defaultValue: 'retail',
    field: 'clientType',
  })
  clientType?: 'retail' | 'wholesale' | 'distributor';

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Please enter a valid email',
      },
    },
  })
  @Index
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  address?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  city?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: 'Rwanda',
  })
  country?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  taxId?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  creditLimit?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  currentBalance?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'isActive',
  })
  isActive!: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  // Relationships
  @HasMany(() => Order)
  orders!: Order[];

  @HasMany(() => Invoice)
  invoices!: Invoice[];
}

