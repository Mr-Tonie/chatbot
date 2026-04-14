/**
 * src/infrastructure/whatsapp/whatsapp.service.js
 *
 * INFRASTRUCTURE LAYER — sends messages via Meta API.
 * Token is passed per call — never read from .env.
 * This enables true multi-tenancy — each client uses their own token.
 */
const axios = require('axios');
const env = require('../../config/env');
const logger = require('../../utils/logger');

const getApiUrl = (phoneNumberId) =>
  `https://graph.facebook.com/${env.whatsapp.apiVersion}/${phoneNumberId}/messages`;

/**
 * Send a plain text message.
 *
 * @param {string} to            - Recipient phone E.164
 * @param {string} text          - Message body
 * @param {string} accessToken   - Tenant's WhatsApp access token
 * @param {string} phoneNumberId - Tenant's WhatsApp phone number ID
 */
const sendTextMessage = async (to, text, accessToken, phoneNumberId) => {
  try {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: text },
    };

    const { data } = await axios.post(getApiUrl(phoneNumberId), payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    logger.info(`[WA:send] ✅ To: ${to} | msgId: ${data?.messages?.[0]?.id}`);
    return data;

  } catch (err) {
    const detail = err.response?.data || err.message;
    logger.error(`[WA:send] ❌ Failed to ${to}: ${JSON.stringify(detail)}`);
    throw err;
  }
};

/**
 * Mark a message as read.
 *
 * @param {string} messageId
 * @param {string} accessToken
 * @param {string} phoneNumberId
 */
const markAsRead = async (messageId, accessToken, phoneNumberId) => {
  try {
    await axios.post(
      getApiUrl(phoneNumberId),
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    logger.debug(`[WA:read] ✅ ${messageId}`);
  } catch {
    logger.warn(`[WA:read] ⚠️ Could not mark as read: ${messageId}`);
  }
};

module.exports = { sendTextMessage, markAsRead };