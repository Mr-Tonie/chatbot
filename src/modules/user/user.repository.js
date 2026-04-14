/**
 * src/modules/user/user.repository.js
 */
const User = require('./user.model');
const logger = require('../../utils/logger');

const findOrCreate = async (phone, clientId) => {
  try {
    const user = await User.findOneAndUpdate(
      { phone, clientId },
      { $setOnInsert: { phone, clientId } },
      { upsert: true, returnDocument: 'after' }
    );
    return user;
  } catch (err) {
    logger.error(`[UserRepo] findOrCreate failed: ${err.message}`);
    throw err;
  }
};

const updateName = async (phone, clientId, name) => {
  try {
    await User.findOneAndUpdate(
      { phone, clientId },
      { name },
      { returnDocument: 'after' }
    );
  } catch (err) {
    logger.error(`[UserRepo] updateName failed: ${err.message}`);
    throw err;
  }
};

module.exports = { findOrCreate, updateName };