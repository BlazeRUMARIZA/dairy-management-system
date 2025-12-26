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
    type: DataType.STRING,
    allowNull: true,
  })
  barcode?: string;

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
    validate: {
      min: 0,
    },
  })
  minThreshold!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  maxCapacity!: number;

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
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  costPrice!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  })
  shelfLife?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  storageTemp?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'isActive',
  })
  isActive!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  supplier?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastRestocked?: Date;
}
