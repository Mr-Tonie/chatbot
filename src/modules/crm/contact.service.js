/**
 * src/modules/crm/contact.service.js
 *
 * BUSINESS LOGIC for CRM operations.
 * Controllers call this — never the repository directly.
 */
const contactRepository = require('./contact.repository');
const messageRepository = require('../message/message.repository');
const logger = require('../../utils/logger');

const getAllContacts = async (clientId) => {
  return await contactRepository.findAll(clientId);
};

const getContactWithHistory = async (phone, clientId) => {
  const contact = await contactRepository.findByPhone(phone, clientId);

  if (!contact) {
    const err = new Error(`Contact not found: ${phone}`);
    err.statusCode = 404;
    throw err;
  }

  const history = await messageRepository.getHistory(contact._id);

  return { contact, history };
};

const addTag = async (phone, clientId, tag) => {
  if (!tag || typeof tag !== 'string') {
    const err = new Error('Tag must be a non-empty string');
    err.statusCode = 400;
    throw err;
  }

  const contact = await contactRepository.addTag(phone, clientId, tag.trim().toLowerCase());

  if (!contact) {
    const err = new Error(`Contact not found: ${phone}`);
    err.statusCode = 404;
    throw err;
  }

  logger.info(`[CRM] Tag "${tag}" added to ${phone}`);
  return contact;
};

const removeTag = async (phone, clientId, tag) => {
  const contact = await contactRepository.removeTag(phone, clientId, tag.trim().toLowerCase());

  if (!contact) {
    const err = new Error(`Contact not found: ${phone}`);
    err.statusCode = 404;
    throw err;
  }

  logger.info(`[CRM] Tag "${tag}" removed from ${phone}`);
  return contact;
};

const updateNote = async (phone, clientId, note) => {
  const contact = await contactRepository.updateNote(phone, clientId, note);

  if (!contact) {
    const err = new Error(`Contact not found: ${phone}`);
    err.statusCode = 404;
    throw err;
  }

  logger.info(`[CRM] Note updated for ${phone}`);
  return contact;
};

const updateStage = async (phone, clientId, stage) => {
  const validStages = ['new', 'lead', 'customer', 'vip', 'inactive'];

  if (!validStages.includes(stage)) {
    const err = new Error(`Invalid stage. Must be one of: ${validStages.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  const contact = await contactRepository.updateStage(phone, clientId, stage);

  if (!contact) {
    const err = new Error(`Contact not found: ${phone}`);
    err.statusCode = 404;
    throw err;
  }

  logger.info(`[CRM] Stage updated to "${stage}" for ${phone}`);
  return contact;
};

module.exports = {
  getAllContacts,
  getContactWithHistory,
  addTag,
  removeTag,
  updateNote,
  updateStage,
};