/**
 * src/modules/crm/contact.controller.js
 *
 * HTTP LAYER — req/res only.
 * Delegates everything to contact.service.
 */
const contactService = require('./contact.service');
const env = require('../../config/env');
const logger = require('../../utils/logger');

const getAllContacts = async (req, res, next) => {
  try {
    const clientId = env.tenant.defaultClientId;
    const contacts = await contactService.getAllContacts(clientId);
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    next(err);
  }
};

const getContact = async (req, res, next) => {
  try {
    const clientId = env.tenant.defaultClientId;
    const { phone } = req.params;
    const result = await contactService.getContactWithHistory(phone, clientId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const addTag = async (req, res, next) => {
  try {
    const clientId = env.tenant.defaultClientId;
    const { phone } = req.params;
    const { tag } = req.body;
    const contact = await contactService.addTag(phone, clientId, tag);
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

const removeTag = async (req, res, next) => {
  try {
    const clientId = env.tenant.defaultClientId;
    const { phone } = req.params;
    const { tag } = req.body;
    const contact = await contactService.removeTag(phone, clientId, tag);
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const clientId = env.tenant.defaultClientId;
    const { phone } = req.params;
    const { note } = req.body;
    const contact = await contactService.updateNote(phone, clientId, note);
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

const updateStage = async (req, res, next) => {
  try {
    const clientId = env.tenant.defaultClientId;
    const { phone } = req.params;
    const { stage } = req.body;
    const contact = await contactService.updateStage(phone, clientId, stage);
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllContacts,
  getContact,
  addTag,
  removeTag,
  updateNote,
  updateStage,
};