const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const graphRoutes = require('./routes/graphRoutes');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Home Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FinShield-AI Backend Running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      upload: '/api/upload',
      dashboard: '/api/dashboard',
      transactions: '/api/transactions',
      graph: '/api/graph'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/graph', graphRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  if (err.message === 'Only CSV files are allowed') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;