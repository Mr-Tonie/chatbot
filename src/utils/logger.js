/**
 * src/utils/logger.js
 */
const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, printf, colorize, errors } = format;

const logLine = printf(({ level, message, timestamp, stack }) =>
  `${timestamp} [${level.toUpperCase()}] ${stack || message}`
);

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logLine
  ),

  transports: [
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'HH:mm:ss' }),
        logLine
      ),
    }),
    new transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join('logs', 'combined.log'),
    }),
  ],
});

module.exports = logger;