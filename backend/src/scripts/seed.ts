import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Product from '../models/Product';
import Client from '../models/Client';
import Order from '../models/Order';
import Batch from '../models/Batch';
import Invoice from '../models/Invoice';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dairy-management');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Client.deleteMany({});
    await Order.deleteMany({});
    await Batch.deleteMany({});
    await Invoice.deleteMany({});

    console.log('🧹 Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'John Admin',
        email: 'admin@dairy.com',
        password: 'password123',
        role: 'admin',
        phone: '+1234567890',
      },
      {
        name: 'Jane Manager',
        email: 'manager@dairy.com',
        password: 'password123',
        role: 'manager',
        phone: '+1234567891',
      },
      {
        name: 'Bob Operator',
        email: 'operator@dairy.com',
        password: 'password123',
        role: 'operator',
        phone: '+1234567892',
      },
      {
        name: 'Alice Driver',
        email: 'driver@dairy.com',
        password: 'password123',
        role: 'driver',
        phone: '+1234567893',
      },
    ]);

    console.log('👥 Created users');

    // Create products
    const products = await Product.create([
      {
        name: 'Fresh Milk 1L',
        category: 'Milk',
        sku: 'MILK-FRESH-1L',
        barcode: 'DRY001234567890',
        description: 'Fresh pasteurized whole milk',
        currentStock: 450,
        minThreshold: 200,
        maxCapacity: 1000,
        unit: 'L',
        unitPrice: 2.50,
        costPrice: 1.80,
        location: 'Refrigerator 1',
        shelfLife: 7,
        storageTemp: '2-4°C',
        supplier: 'Local Farms Co.',
      },
      {
        name: 'Greek Yogurt 400g',
        category: 'Yogurt',
        sku: 'YOG-GREEK-400G',
        barcode: 'DRY001234567891',
        description: 'Creamy Greek-style yogurt',
        currentStock: 180,
        minThreshold: 120,
        maxCapacity: 500,
        unit: 'units',
        unitPrice: 3.20,
        costPrice: 2.10,
        location: 'Refrigerator 2',
        shelfLife: 14,
        storageTemp: '2-4°C',
        supplier: 'In-house Production',
      },
      {
        name: 'Cheddar Cheese 200g',
        category: 'Cheese',
        sku: 'CHE-CHED-200G',
        barcode: 'DRY001234567892',
        description: 'Aged cheddar cheese',
        currentStock: 85,
        minThreshold: 50,
        maxCapacity: 200,
        unit: 'units',
        unitPrice: 5.50,
        costPrice: 3.80,
        location: 'Cold Storage 1',
        shelfLife: 60,
        storageTemp: '2-8°C',
        supplier: 'Artisan Cheese Co.',
      },
      {
        name: 'Butter 250g',
        category: 'Butter',
        sku: 'BUT-UNSAL-250G',
        barcode: 'DRY001234567893',
        description: 'Unsalted butter',
        currentStock: 120,
        minThreshold: 80,
        maxCapacity: 300,
        unit: 'units',
        unitPrice: 4.00,
        costPrice: 2.80,
        location: 'Cold Storage 2',
        shelfLife: 90,
        storageTemp: '2-4°C',
        supplier: 'In-house Production',
      },
    ]);

    console.log('🥛 Created products');

    // Create clients
    const clients = await Client.create([
      {
        name: 'Restaurant La Belle',
        type: 'Restaurant',
        email: 'contact@labelle.fr',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de la Paix, 75001 Paris',
        contact: {
          name: 'Jean Dupont',
          position: 'Manager',
          email: 'jean.dupont@labelle.fr',
          phone: '+33 6 12 34 56 78',
        },
        billingAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          zipCode: '75001',
          country: 'France',
        },
        deliveryAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          zipCode: '75001',
          country: 'France',
        },
        status: 'active',
        rating: 5,
        preferences: {
          deliveryDays: ['Monday', 'Wednesday', 'Friday'],
          paymentTerms: 30,
          deliveryTime: '07:00-09:00',
        },
      },
      {
        name: 'SuperMarket Plus',
        type: 'Grocery',
        email: 'orders@supermarketplus.com',
        phone: '+33 1 98 76 54 32',
        address: '456 Avenue des Champs, 75008 Paris',
        contact: {
          name: 'Marie Laurent',
          position: 'Procurement Manager',
        },
        status: 'active',
        rating: 4,
        preferences: {
          deliveryDays: ['Tuesday', 'Thursday'],
          paymentTerms: 15,
        },
      },
      {
        name: 'Hotel Grand',
        type: 'Hotel',
        email: 'supplies@hotelgrand.com',
        phone: '+33 1 45 67 89 01',
        address: '789 Boulevard Royal, 75009 Paris',
        status: 'active',
        rating: 5,
      },
    ]);

    console.log('🏢 Created clients');

    // Create batches
    const batches = await Batch.create([
      {
        product: 'Fresh Milk',
        productType: 'milk',
        productId: products[0]._id,
        quantity: 2500,
        unit: 'L',
        status: 'completed',
        operatorId: users[2]._id,
        operator: users[2].name,
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 20 * 60 * 60 * 1000),
        temperature: 72,
        pH: 6.8,
        yield: 98,
        qualityChecks: {
          temperature: 'pass',
          pH: 'pass',
          bacteria: 'pass',
        },
      },
      {
        product: 'Greek Yogurt',
        productType: 'yogurt',
        productId: products[1]._id,
        quantity: 1200,
        unit: 'L',
        status: 'in-progress',
        operatorId: users[2]._id,
        operator: users[2].name,
        startTime: new Date(),
        temperature: 43,
        pH: 4.5,
        qualityChecks: {
          temperature: 'pass',
          pH: 'pending',
          bacteria: 'pending',
        },
      },
    ]);

    console.log('🏭 Created batches');

    // Create orders
    const orders = await Order.create([
      {
        clientId: clients[0]._id,
        clientName: clients[0].name,
        status: 'delivered',
        items: [
          {
            productId: products[0]._id,
            productName: products[0].name,
            quantity: 50,
            unit: products[0].unit,
            unitPrice: products[0].unitPrice,
            total: 50 * products[0].unitPrice,
          },
          {
            productId: products[2]._id,
            productName: products[2].name,
            quantity: 10,
            unit: products[2].unit,
            unitPrice: products[2].unitPrice,
            total: 10 * products[2].unitPrice,
          },
        ],
        subtotal: 180,
        tax: 36,
        total: 216,
        deliveryAddress: clients[0].deliveryAddress!,
        deliveryDate: new Date(),
        deliveryTime: '07:00-09:00',
        driverId: users[3]._id,
        driverName: users[3].name,
        tracking: {
          status: 'delivered',
          events: [
            {
              status: 'pending',
              timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
              note: 'Order created',
            },
            {
              status: 'delivered',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
              note: 'Order delivered',
            },
          ],
        },
        createdBy: users[1]._id,
      },
      {
        clientId: clients[1]._id,
        clientName: clients[1].name,
        status: 'pending',
        items: [
          {
            productId: products[0]._id,
            productName: products[0].name,
            quantity: 100,
            unit: products[0].unit,
            unitPrice: products[0].unitPrice,
            total: 100 * products[0].unitPrice,
          },
          {
            productId: products[1]._id,
            productName: products[1].name,
            quantity: 50,
            unit: products[1].unit,
            unitPrice: products[1].unitPrice,
            total: 50 * products[1].unitPrice,
          },
        ],
        subtotal: 410,
        tax: 82,
        total: 492,
        deliveryAddress: {
          street: '456 Avenue des Champs',
          city: 'Paris',
          zipCode: '75008',
          country: 'France',
        },
        deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        tracking: {
          status: 'pending',
          events: [
            {
              status: 'pending',
              timestamp: new Date(),
              note: 'Order created',
            },
          ],
        },
        createdBy: users[1]._id,
      },
    ]);

    console.log('📦 Created orders');

    // Create invoices
    await Invoice.create([
      {
        orderId: orders[0]._id,
        clientId: clients[0]._id,
        clientName: clients[0].name,
        items: [
          {
            description: products[0].name,
            quantity: 50,
            unitPrice: products[0].unitPrice,
            total: 125,
          },
          {
            description: products[2].name,
            quantity: 10,
            unitPrice: products[2].unitPrice,
            total: 55,
          },
        ],
        subtotal: 180,
        tax: 36,
        total: 216,
        status: 'paid',
        issueDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        paymentMethod: 'Bank Transfer',
        createdBy: users[1]._id,
      },
      {
        orderId: orders[1]._id,
        clientId: clients[1]._id,
        clientName: clients[1].name,
        items: [
          {
            description: products[0].name,
            quantity: 100,
            unitPrice: products[0].unitPrice,
            total: 250,
          },
          {
            description: products[1].name,
            quantity: 50,
            unitPrice: products[1].unitPrice,
            total: 160,
          },
        ],
        subtotal: 410,
        tax: 82,
        total: 492,
        status: 'sent',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdBy: users[1]._id,
      },
    ]);

    console.log('📄 Created invoices');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Test Users:');
    console.log('  Admin: admin@dairy.com / password123');
    console.log('  Manager: manager@dairy.com / password123');
    console.log('  Operator: operator@dairy.com / password123');
    console.log('  Driver: driver@dairy.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(() => seedData());
