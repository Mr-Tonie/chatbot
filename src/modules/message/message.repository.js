/**
 * src/modules/message/message.repository.js
 */
const Message = require('./message.model');
const logger = require('../../utils/logger');

const save = async (data) => {
  try {
    const message = await Message.create(data);
    logger.debug(`[MsgRepo] Saved ${data.direction} message for ${data.phone}`);
    return message;
  } catch (err) {
    logger.error(`[MsgRepo] save failed: ${err.message}`);
    throw err;
  }
};

const getHistory = async (userId, limit = 20) => {
  try {
    return await Message.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  } catch (err) {
    logger.error(`[MsgRepo] getHistory failed: ${err.message}`);
    throw err;
  }
};

module.exports = { save, getHistory };