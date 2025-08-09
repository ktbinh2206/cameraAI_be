const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Validate MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
      connectTimeoutMS: 30000
    });

    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Test the connection
    await mongoose.connection.db.admin().ping();
    console.log('✅ Database ping successful');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // More specific error handling
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed. Check your MongoDB credentials.');
    } else if (error.message.includes('timeout')) {
      console.error('⏰ Connection timeout. Check your network connection and MongoDB URI.');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 DNS resolution failed. Check your MongoDB hostname.');
    }
    
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('📡 MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

module.exports = connectDB;
