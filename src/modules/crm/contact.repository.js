/**
 * src/modules/crm/contact.repository.js
 *
 * All DB operations for CRM contacts.
 */
const Contact = require('./contact.model');
const logger = require('../../utils/logger');

/**
 * Find or create a contact on first message.
 */
const findOrCreate = async (phone, clientId) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { phone, clientId },
      {
        $setOnInsert: { phone, clientId },
        $set: { lastSeenAt: new Date() },
        $inc: { messageCount: 1 },
      },
      { upsert: true, returnDocument: 'after' }
    );
    return contact;
  } catch (err) {
    logger.error(`[ContactRepo] findOrCreate failed: ${err.message}`);
    throw err;
  }
};

/**
 * Get all contacts for a client.
 */
const findAll = async (clientId) => {
  try {
    return await Contact.find({ clientId }).sort({ lastSeenAt: -1 });
  } catch (err) {
    logger.error(`[ContactRepo] findAll failed: ${err.message}`);
    throw err;
  }
};

/**
 * Get one contact by phone.
 */
const findByPhone = async (phone, clientId) => {
  try {
    return await Contact.findOne({ phone, clientId });
  } catch (err) {
    logger.error(`[ContactRepo] findByPhone failed: ${err.message}`);
    throw err;
  }
};

/**
 * Add a tag to a contact.
 */
const addTag = async (phone, clientId, tag) => {
  try {
    return await Contact.findOneAndUpdate(
      { phone, clientId },
      { $addToSet: { tags: tag } },
      { returnDocument: 'after' }
    );
  } catch (err) {
    logger.error(`[ContactRepo] addTag failed: ${err.message}`);
    throw err;
  }
};

/**
 * Remove a tag from a contact.
 */
const removeTag = async (phone, clientId, tag) => {
  try {
    return await Contact.findOneAndUpdate(
      { phone, clientId },
      { $pull: { tags: tag } },
      { returnDocument: 'after' }
    );
  } catch (err) {
    logger.error(`[ContactRepo] removeTag failed: ${err.message}`);
    throw err;
  }
};

/**
 * Update note on a contact.
 */
const updateNote = async (phone, clientId, note) => {
  try {
    return await Contact.findOneAndUpdate(
      { phone, clientId },
      { note },
      { returnDocument: 'after' }
    );
  } catch (err) {
    logger.error(`[ContactRepo] updateNote failed: ${err.message}`);
    throw err;
  }
};

/**
 * Update stage of a contact.
 */
const updateStage = async (phone, clientId, stage) => {
  try {
    return await Contact.findOneAndUpdate(
      { phone, clientId },
      { stage },
      { returnDocument: 'after' }
    );
  } catch (err) {
    logger.error(`[ContactRepo] updateStage failed: ${err.message}`);
    throw err;
  }
};

module.exports = {
  findOrCreate,
  findAll,
  findByPhone,
  addTag,
  removeTag,
  updateNote,
  updateStage,
};