/**
 * src/app.js
 */
const express = require('express');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const queue = require('./queue/queue');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'WhatsApp SaaS Chatbot Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    queue: queue.getStatus(),
  });
});

app.use('/', routes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;