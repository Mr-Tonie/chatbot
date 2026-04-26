/**
 * src/modules/whatsapp/whatsapp.message.service.js
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

  if (!phoneNumberId) {
    logger.error('[WA:msg] No phoneNumberId in payload — message dropped');
    return;
  }

  const tenant = await tenantService.resolveByPhoneNumberId(phoneNumberId);

  if (!tenant) {
    return;
  }

  logger.info(`[WA:msg] Tenant: ${tenant.clientId} | From: ${userPhone} | type: ${type}`);

  queue.enqueue('incoming_message', {
    clientId: tenant.clientId,
    accessToken: tenant.whatsapp.accessToken,
    phoneNumberId: tenant.whatsapp.phoneNumberId,
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