/**
 * src/modules/chatbot/chatbot.service.js
 */
const { getState, setState, resetState } = require('./state.manager');
const { handleWelcomeFlow } = require('./flows/welcome.flow');
const { handleBookingFlow } = require('./flows/booking.flow');
const { handleSupportFlow } = require('./flows/support.flow');
const userRepository = require('../user/user.repository');
const contactRepository = require('../crm/contact.repository');
const messageRepository = require('../message/message.repository');
const { FLOWS, RESTART_TRIGGERS } = require('../../utils/constants');
const logger = require('../../utils/logger');

const processMessage = async ({ clientId, userPhone, text }) => {

  // ── Guards ────────────────────────────────────────────────────
  if (!userPhone) {
    logger.warn('[Chatbot] Missing userPhone — skipping');
    return null;
  }
  if (!clientId) {
    logger.warn('[Chatbot] Missing clientId — skipping');
    return null;
  }

  // ── Sanitise ──────────────────────────────────────────────────
  const raw = (text || '').trim();
  const normalised = raw.toLowerCase();

  if (!raw) {
    logger.warn(`[Chatbot] Empty message from ${userPhone}`);
    return null;
  }

  // ── 1. Upsert user + contact ──────────────────────────────────
  const user = await userRepository.findOrCreate(userPhone, clientId);
  await contactRepository.findOrCreate(userPhone, clientId);

  // ── 2. Handle restart ─────────────────────────────────────────
  if (RESTART_TRIGGERS.includes(normalised)) {
    resetState(clientId, userPhone);
    logger.debug(`[Chatbot] Restart by ${userPhone}`);
  }

  // ── 3. Get state ──────────────────────────────────────────────
  const state = getState(clientId, userPhone);

  logger.debug(
    `[Chatbot] ${userPhone} | flow: ${state.flow} | step: ${state.step} | msg: "${raw}"`
  );

  // ── 4. Save incoming message ──────────────────────────────────
  await messageRepository.save({
    clientId,
    userId: user._id,
    phone: userPhone,
    direction: 'incoming',
    type: 'text',
    text: raw,
    flow: state.flow,
    step: state.step,
    status: 'received',
  });

  // ── 5. Route to flow ──────────────────────────────────────────
  const { reply, nextState } = routeToFlow(raw, state);

  // ── 6. Save state ─────────────────────────────────────────────
  setState(clientId, userPhone, nextState);

  // ── 7. Save outgoing message ──────────────────────────────────
  await messageRepository.save({
    clientId,
    userId: user._id,
    phone: userPhone,
    direction: 'outgoing',
    type: 'text',
    text: reply,
    flow: nextState.flow,
    step: nextState.step,
    status: 'sent',
  });

  return reply;
};

const routeToFlow = (text, state) => {
  switch (state.flow) {
    case FLOWS.BOOKING: return handleBookingFlow(text, state);
    case FLOWS.SUPPORT: return handleSupportFlow(text, state);
    case FLOWS.WELCOME:
    default: return handleWelcomeFlow(text, state);
  }
};

module.exports = { processMessage };