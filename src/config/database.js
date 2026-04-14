/**
 * src/config/database.js
 */
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('[DB] MongoDB connected');
  } catch (err) {
    logger.error(`[DB] Connection failed: ${err.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('[DB] MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('[DB] MongoDB reconnected');
});

module.exports = { connect };