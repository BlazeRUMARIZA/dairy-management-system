import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'products',
  timestamps: true,
})
export default class Product extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.ENUM('Milk', 'Yogurt', 'Cheese', 'Butter', 'Cream', 'Other'),
    allowNull: false,
  })
  category!: 'Milk' | 'Yogurt' | 'Cheese' | 'Butter' | 'Cream' | 'Other';

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  sku!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  currentStock!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
    field: 'minStock',
  })
  minStock!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0,
    },
    field: 'maxStock',
  })
  maxStock?: number;

  @Column({
    type: DataType.ENUM('L', 'kg', 'units', 'g', 'ml'),
    allowNull: false,
  })
  unit!: 'L' | 'kg' | 'units' | 'g' | 'ml';

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  unitPrice!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0,
    },
  })
  costPrice?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 7,
    validate: {
      min: 0,
    },
    field: 'expiryDays',
  })
  expiryDays?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'isActive',
  })
  isActive!: boolean;
}
