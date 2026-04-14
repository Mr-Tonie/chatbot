/**
 * src/queue/queue.js
 *
 * In-memory job queue — Phase 5 foundation.
 *
 * Interface is deliberately simple so Redis can drop in later
 * without changing any other file in the project.
 *
 * Job shape:
 * {
 *   id:        string    — unique job ID
 *   type:      string    — job type e.g. 'incoming_message'
 *   payload:   object    — job data
 *   attempts:  number    — how many times we tried
 *   createdAt: Date
 * }
 */
const logger = require('../utils/logger');

const MAX_RETRIES = 3;

// In-memory store — replaced by Redis in Phase 5b
const jobs = [];
let running = false;

/**
 * Add a job to the queue.
 * @param {string} type     - Job type identifier
 * @param {object} payload  - Data the worker needs
 */
const enqueue = (type, payload) => {
  const job = {
    id: `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    payload,
    attempts: 0,
    createdAt: new Date(),
  };

  jobs.push(job);
  logger.debug(`[Queue] Enqueued job ${job.id} | type: ${type} | depth: ${jobs.length}`);

  // Trigger worker on next tick — never block the current request
  setImmediate(process);

  return job.id;
};

/**
 * Register a handler function for a job type.
 * Workers call this to declare what they handle.
 */
const handlers = {};

const register = (type, handler) => {
  handlers[type] = handler;
  logger.debug(`[Queue] Registered handler for: ${type}`);
};

/**
 * Process the next job in the queue.
 * Called automatically after enqueue.
 */
const process = async () => {
  if (running || jobs.length === 0) return;

  running = true;
  const job = jobs.shift();

  try {
    const handler = handlers[job.type];

    if (!handler) {
      logger.warn(`[Queue] No handler registered for type: ${job.type}`);
      running = false;
      return;
    }

    job.attempts++;
    logger.debug(`[Queue] Processing job ${job.id} | attempt: ${job.attempts}`);

    await handler(job.payload);

    logger.debug(`[Queue] Completed job ${job.id}`);

  } catch (err) {
    logger.error(`[Queue] Job ${job.id} failed: ${err.message}`);

    // Retry logic — re-queue if under max attempts
    if (job.attempts < MAX_RETRIES) {
      logger.warn(`[Queue] Retrying job ${job.id} | attempt ${job.attempts}/${MAX_RETRIES}`);
      jobs.unshift(job); // put back at front of queue
    } else {
      logger.error(`[Queue] Job ${job.id} permanently failed after ${MAX_RETRIES} attempts`);
    }
  }

  running = false;

  // Process next job if any remain
  if (jobs.length > 0) {
    setImmediate(process);
  }
};

/**
 * Get queue status — useful for health checks and monitoring.
 */
const getStatus = () => ({
  depth: jobs.length,
  running,
});

module.exports = { enqueue, register, getStatus };