/**
 * src/utils/constants.js
 *
 * All magic strings in one place.
 * Never hardcode these inline — always import from here.
 */

// ── Meta event type ───────────────────────────────────────────
const WHATSAPP_BUSINESS_ACCOUNT = 'whatsapp_business_account';

// ── Message types Meta sends ──────────────────────────────────
const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
  DOCUMENT: 'document',
  LOCATION: 'location',
  STICKER: 'sticker',
};

// ── Chatbot flow names ────────────────────────────────────────
const FLOWS = {
  WELCOME: 'welcome',
  BOOKING: 'booking',
  SUPPORT: 'support',
};

// ── Step names per flow ───────────────────────────────────────
const STEPS = {
  // Shared
  START: 'start',

  // Welcome
  MENU: 'menu',
  WAITING_HUMAN: 'waiting_human',

  // Booking
  ASK_NAME: 'ask_name',
  SAVE_NAME: 'save_name',
  SAVE_DATE: 'save_date',
  SAVE_SERVICE: 'save_service',
  CONFIRM: 'confirm',

  // Support
  ASK_ISSUE: 'ask_issue',
  SAVE_ISSUE: 'save_issue',
};

// ── Words that always restart the conversation ────────────────
const RESTART_TRIGGERS = ['hi', 'hello', 'hey', 'start', 'menu', 'restart'];

module.exports = {
  WHATSAPP_BUSINESS_ACCOUNT,
  MESSAGE_TYPES,
  FLOWS,
  STEPS,
  RESTART_TRIGGERS,
};