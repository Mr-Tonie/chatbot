/**
 * src/middlewares/requestLogger.js
 */
const morgan = require('morgan');
const logger = require('../utils/logger');

const stream = {
  write: (message) => logger.http(message.trim()),
};

module.exports = morgan(':method :url :status :response-time ms', { stream });