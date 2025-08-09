const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Import route modules
const blogRoutes = require('./blogRoutes');

// Mount routes
router.use('/blogs', blogRoutes);

// Health check route with database connectivity
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    // Simple database ping
    let dbPing = false;
    if (dbState === 1) {
      try {
        await mongoose.connection.db.admin().ping();
        dbPing = true;
      } catch (error) {
        console.error('Database ping failed:', error.message);
      }
    }

    const healthData = {
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || 'v1',
      database: {
        status: dbStatus[dbState] || 'unknown',
        connected: dbState === 1,
        ping: dbPing
      },
      environment: process.env.NODE_ENV || 'development'
    };

    // Return appropriate status code based on database health
    const statusCode = (dbState === 1 && dbPing) ? 200 : 503;
    res.status(statusCode).json(healthData);
    
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
