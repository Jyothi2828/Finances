const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  try {
    // Updated options to address all deprecation warnings
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      writeConcern: {
        w: 'majority',
        j: true
      }
    });
    console.log('[SERVER] MongoDB Atlas connected successfully to ' + config.dbName + ' database');
  } catch (err) {
    console.error('[SERVER ERROR] MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;