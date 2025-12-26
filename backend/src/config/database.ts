import { Sequelize } from 'sequelize-typescript';
import 'reflect-metadata';
import { User } from '../models/User';
import Product from '../models/Product';
import Client from '../models/Client';
import Order from '../models/Order';
import Batch from '../models/Batch';
import Invoice from '../models/Invoice';

const sequelize = new Sequelize({
  database: process.env.DB_DATABASE || process.env.DB_NAME || 'dairy_management',
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: false
  }
});

// Add models to sequelize instance
sequelize.addModels([User, Product, Client, Order, Batch, Invoice]);

// Initialize model hooks (for password hashing, etc.)
User.initHooks();
Product.initHooks();
Order.initHooks();
Batch.initHooks();
Invoice.initHooks();

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL Connected: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3306'}`);
    
    // Sync models in development (create tables if they don't exist)
    if (process.env.NODE_ENV === 'development' || process.env.DB_SYNC === 'true') {
      await sequelize.sync({ alter: process.env.DB_ALTER === 'true' });
      console.log('✅ Database models synchronized');
    }

    process.on('SIGINT', async () => {
      await sequelize.close();
      console.log('MySQL connection closed due to app termination');
      process.exit(0);
    });
  } catch (error: any) {
    console.error('❌ Error connecting to MySQL:', error.message);
    console.log('⚠️  Server will continue running without database');
    console.log('⚠️  Please check your database configuration:');
    console.log(`    DB_HOST: ${process.env.DB_HOST || 'not set'}`);
    console.log(`    DB_PORT: ${process.env.DB_PORT || 'not set'}`);
    console.log(`    DB_USERNAME: ${process.env.DB_USERNAME || process.env.DB_USER || 'not set'}`);
    console.log(`    DB_DATABASE: ${process.env.DB_DATABASE || process.env.DB_NAME || 'not set'}`);
    // Don't exit - let server continue running
  }
};

export default connectDB;
export { sequelize };

