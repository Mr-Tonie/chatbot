/**
 * src/utils/encryption.js
 *
 * AES-256-CBC encryption for sensitive fields.
 * Used to encrypt WhatsApp access tokens before storing in MongoDB.
 *
 * Never store tokens in plain text — ever.
 */
const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

if (!SECRET_KEY || SECRET_KEY.length !== 32) {
  console.error('[Encryption] ❌ ENCRYPTION_KEY must be exactly 32 characters');
  process.exit(1);
}

/**
 * Encrypt a plain text string.
 * @param {string} text
 * @returns {string} encrypted — format: iv:encryptedData (hex)
 */
const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

/**
 * Decrypt an encrypted string.
 * @param {string} hash — format: iv:encryptedData (hex)
 * @returns {string} plain text
 */
const decrypt = (hash) => {
  const [ivHex, encryptedHex] = hash.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString();
};

module.exports = { encrypt, decrypt };