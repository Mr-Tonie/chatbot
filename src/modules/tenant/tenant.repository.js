/**
 * src/modules/tenant/tenant.repository.js
 *
 * All DB operations for tenants.
 * Encrypts token on write, decrypts on read.
 */
const Tenant = require('./tenant.model');
const { encrypt, decrypt } = require('../../utils/encryption');
const logger = require('../../utils/logger');

/**
 * Find active tenant by WhatsApp phone number ID.
 * Returns tenant with decrypted access token.
 *
 * @param {string} phoneNumberId
 * @returns {Promise<object|null>}
 */
const findByPhoneNumberId = async (phoneNumberId) => {
  try {
    const tenant = await Tenant.findOne({
      'whatsapp.phoneNumberId': phoneNumberId,
      status: 'active',
    });

    if (!tenant) return null;

    return decryptTenant(tenant);
  } catch (err) {
    logger.error(`[TenantRepo] findByPhoneNumberId failed: ${err.message}`);
    throw err;
  }
};

/**
 * Find active tenant by clientId.
 */
const findByClientId = async (clientId) => {
  try {
    const tenant = await Tenant.findOne({ clientId, status: 'active' });
    if (!tenant) return null;
    return decryptTenant(tenant);
  } catch (err) {
    logger.error(`[TenantRepo] findByClientId failed: ${err.message}`);
    throw err;
  }
};

/**
 * Create a new tenant.
 * Encrypts access token before saving.
 */
const create = async (data) => {
  try {
    const payload = {
      ...data,
      whatsapp: {
        ...data.whatsapp,
        accessToken: encrypt(data.whatsapp.accessToken),
      },
    };

    const tenant = await Tenant.create(payload);
    logger.info(`[TenantRepo] Created tenant: ${tenant.clientId}`);
    return decryptTenant(tenant);
  } catch (err) {
    logger.error(`[TenantRepo] create failed: ${err.message}`);
    throw err;
  }
};

/**
 * Get all tenants — tokens NOT decrypted in list view.
 */
const findAll = async () => {
  try {
    return await Tenant.find({}, { 'whatsapp.accessToken': 0 })
      .sort({ createdAt: -1 });
  } catch (err) {
    logger.error(`[TenantRepo] findAll failed: ${err.message}`);
    throw err;
  }
};

/**
 * Update tenant status.
 */
const updateStatus = async (clientId, status) => {
  try {
    return await Tenant.findOneAndUpdate(
      { clientId },
      { status },
      { returnDocument: 'after' }
    );
  } catch (err) {
    logger.error(`[TenantRepo] updateStatus failed: ${err.message}`);
    throw err;
  }
};

// ── Private helpers ──────────────────────────────────────────

/**
 * Return a plain object with decrypted access token.
 * Never mutate the Mongoose document directly.
 */
const decryptTenant = (tenant) => {
  const obj = tenant.toObject();
  obj.whatsapp.accessToken = decrypt(obj.whatsapp.accessToken);
  return obj;
};

module.exports = {
  findByPhoneNumberId,
  findByClientId,
  create,
  findAll,
  updateStatus,
};