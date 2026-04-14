/**
 * src/queue/worker.js
 *
 * Processes incoming_message jobs.
 * Uses tenant's own accessToken — not a global one.
 */
const queue = require('./queue');
const { processMessage } = require('../modules/chatbot/chatbot.service');
const { sendTextMessage, markAsRead } = require('../infrastructure/whatsapp/whatsapp.service');
const logger = require('../utils/logger');

const handleIncomingMessage = async (payload) => {
  const { clientId, accessToken, phoneNumberId, userPhone, messageId, type, text } = payload;

  logger.info(`[Worker] Processing | client: ${clientId} | from: ${userPhone}`);

  // Mark as read using tenant's token
  await markAsRead(messageId, accessToken, phoneNumberId);

  if (type !== 'text') {
    await sendTextMessage(
      userPhone,
      '⚠️ Sorry, I can only process text messages right now.',
      accessToken,
      phoneNumberId
    );
    return;
  }

  // Chatbot processes message
  const reply = await processMessage({ clientId, userPhone, text });

  if (!reply) {
    logger.warn(`[Worker] No reply for ${userPhone}`);
    return;
  }

  // Send reply using tenant's own token
  await sendTextMessage(userPhone, reply, accessToken, phoneNumberId);

  logger.info(`[Worker] Reply sent to ${userPhone}`);
};

const start = () => {
  queue.register('incoming_message', handleIncomingMessage);
  logger.info('[Worker] All handlers registered');
};

module.exports = { start };