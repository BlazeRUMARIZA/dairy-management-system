import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database';
import { errorHandler, notFound } from './middleware/error';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app: Application = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Compression
app.use(compression());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter);

// Import routes
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import clientRoutes from './routes/clientRoutes';
import orderRoutes from './routes/orderRoutes';
import batchRoutes from './routes/batchRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

// Mount routes
const apiVersion = process.env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/products`, productRoutes);
app.use(`/api/${apiVersion}/clients`, clientRoutes);
app.use(`/api/${apiVersion}/orders`, orderRoutes);
app.use(`/api/${apiVersion}/batches`, batchRoutes);
app.use(`/api/${apiVersion}/invoices`, invoiceRoutes);
app.use(`/api/${apiVersion}`, dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Home route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dairy Management System API',
    version: apiVersion,
    documentation: '/api-docs',
  });
});

// Error handler
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🥛 Dairy Management System API      ║
  ║   Server running on port ${PORT}        ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}           ║
  ╚════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
