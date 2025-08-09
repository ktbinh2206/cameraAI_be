const express = require('express');
const router = express.Router();

// Import route modules
const blogRoutes = require('./blogRoutes');

// Mount routes
router.use('/blogs', blogRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1'
  });
});

module.exports = router;
