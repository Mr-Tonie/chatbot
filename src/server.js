/**
 * src/server.js
 */
const { server: cfg } = require('./config/env');
const app = require('./app');
const logger = require('./utils/logger');
const database = require('./config/database');
const worker = require('./queue/worker');

const start = async () => {
  // 1. Connect to MongoDB
  await database.connect();

  // 2. Start queue worker — registers all job handlers
  worker.start();

  // 3. Start HTTP server
  const httpServer = app.listen(cfg.port, () => {
    logger.info('──────────────────────────────────────────');
    logger.info('  WhatsApp SaaS Chatbot Platform');
    logger.info(`  Env     : ${cfg.nodeEnv}`);
    logger.info(`  Port    : ${cfg.port}`);
    logger.info(`  Health  : http://localhost:${cfg.port}/health`);
    logger.info(`  Webhook : http://localhost:${cfg.port}/webhook`);
    logger.info('──────────────────────────────────────────');
  });

  const shutdown = (signal) => {
    logger.info(`[Server] ${signal} received — shutting down gracefully`);
    httpServer.close(() => {
      logger.info('[Server] All connections closed. Bye 👋');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error(`[Server] Unhandled rejection: ${reason}`);
  });
};

start();