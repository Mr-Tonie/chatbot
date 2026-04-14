/**
 * src/modules/whatsapp/whatsapp.message.service.js
 *
 * TRANSPORT LAYER only.
 * Resolves tenant → validates → enqueues → returns.
 *
 * RULE: If tenant cannot be resolved, message is DROPPED.
 * No fallback. No data leakage between clients. Ever.
 */
const queue = require('../../queue/queue');
const tenantService = require('../tenant/tenant.service');
const logger = require('../../utils/logger');

const WHATSAPP_BUSINESS_ACCOUNT = 'whatsapp_business_account';

const handleIncoming = async (body) => {
  if (body.object !== WHATSAPP_BUSINESS_ACCOUNT) return;

  const message = extractMessage(body);
  if (!message) return;

  const { userPhone, messageId, type, text, phoneNumberId } = message;

  // Resolve tenant — hard stop if not found
  if (!phoneNumberId) {
    logger.error('[WA:msg] ❌ No phoneNumberId in payload — message dropped');
    return;
  }

  const tenant = await tenantService.resolveByPhoneNumberId(phoneNumberId);

  if (!tenant) {
    // Error already logged in tenantService
    return;
  }

  logger.info(
    `[WA:msg] ✅ Tenant: ${tenant.clientId} | From: ${userPhone} | type: ${type}`
  );

  // Enqueue with tenant-specific access token
  queue.enqueue('incoming_message', {
    clientId: tenant.clientId,
    accessToken: tenant.whatsapp.accessToken, // tenant's own token
    userPhone,
    messageId,
    type,
    text,
  });
};

const extractMessage = (body) => {
  const value = body.entry?.[0]?.changes?.[0]?.value;
  const msg = value?.messages?.[0];
  if (!msg) return null;

  return {
    userPhone: msg.from,
    messageId: msg.id,
    type: msg.type,
    text: msg.text?.body ?? null,
    phoneNumberId: value?.metadata?.phone_number_id ?? null,
  };
};

module.exports = { handleIncoming };