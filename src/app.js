import express from 'express';
import dotenv from 'dotenv';
import { corsOptions } from './middlewares/cors.middleware.js';
import { sanitizeInput } from './middlewares/sanitise.middleware.js';
import { globalErrorHandler } from './utils/errorHandler.js';
import AppError from './utils/AppError.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();

// Middleware
app.use(corsOptions);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(...sanitizeInput);

// Root route - MUST come BEFORE the 404 handler
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Employee Portal API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    endpoints: {
      auth: '/api/auth',
      employees: '/api/employees',
      departments: '/api/departments',
      roles: '/api/roles',
      attendance: '/api/attendance'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    status: 'OK', 
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', routes);

// 404 handler - This should be LAST
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;