const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers to prevent querySrv ECONNREFUSED on local/Windows environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setServers is restricted
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hariharan_portfolio', {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn('Backend will continue running, but database operations will fail until MongoDB is active.');
    return false;
  }
};

module.exports = connectDB;
