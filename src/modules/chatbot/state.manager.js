/**
 * src/modules/chatbot/state.manager.js
 *
 * Tracks conversation position per user.
 *
 * Phase 1-2: In-memory Map.
 * Phase 3+:  MongoDB (interface stays identical — only internals swap).
 *
 * State shape:
 * {
 *   clientId:  string
 *   userPhone: string
 *   flow:      string
 *   step:      string
 *   context:   {}      ← collects data during conversation
 *   updatedAt: Date
 * }
 */
const { FLOWS, STEPS } = require('../../utils/constants');

const store = new Map();

const DEFAULT_STATE = {
  flow: FLOWS.WELCOME,
  step: STEPS.START,
  context: {},          // renamed from data — more descriptive, DB-ready
  updatedAt: null,
};

const getState = (clientId, userPhone) => {
  const key = `${clientId}:${userPhone}`;
  return store.get(key) ?? { ...DEFAULT_STATE };
};

const setState = (clientId, userPhone, updates) => {
  const key = `${clientId}:${userPhone}`;
  const current = getState(clientId, userPhone);
  const next = { ...current, ...updates, updatedAt: new Date() };
  store.set(key, next);
  return next;
};

const resetState = (clientId, userPhone) => {
  const key = `${clientId}:${userPhone}`;
  store.delete(key);
};

module.exports = { getState, setState, resetState };