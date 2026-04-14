/**
 * src/modules/whatsapp/webhook.controller.js
 * HTTP LAYER only.
 */
const env = require('../../config/env');
const whatsappMessageService = require('./whatsapp.message.service');
const logger = require('../../utils/logger');

const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === env.whatsapp.verifyToken) {
    logger.info('[Webhook] ✅ Verified');
    return res.status(200).send(challenge);
  }

  logger.warn('[Webhook] ❌ Verification failed');
  return res.status(403).json({ error: 'Forbidden' });
};

const receiveMessage = async (req, res) => {
  res.status(200).json({ status: 'received' });

  try {
    // No clientId passed — resolved inside service from phoneNumberId
    await whatsappMessageService.handleIncoming(req.body);
  } catch (err) {
    logger.error(`[Webhook] ❌ ${err.message}`);
  }
};

module.exports = { verifyWebhook, receiveMessage };