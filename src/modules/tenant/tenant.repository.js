const Tenant = require('./tenant.model');
const { encrypt, decrypt } = require('../../utils/encryption');
const logger = require('../../utils/logger');

const decryptTenant = (tenant) => {
  const obj = tenant.toObject();
  obj.whatsapp.accessToken = decrypt(obj.whatsapp.accessToken);
  return obj;
};

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

const findAll = async () => {
  try {
    return await Tenant.find({}, { 'whatsapp.accessToken': 0 }).sort({ createdAt: -1 });
  } catch (err) {
    logger.error(`[TenantRepo] findAll failed: ${err.message}`);
    throw err;
  }
};

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

const updateToken = async (clientId, accessToken) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      { clientId },
      { 'whatsapp.accessToken': encrypt(accessToken) },
      { returnDocument: 'after' }
    );
    if (!tenant) return null;
    return decryptTenant(tenant);
  } catch (err) {
    logger.error(`[TenantRepo] updateToken failed: ${err.message}`);
    throw err;
  }
};

module.exports = {
  findByPhoneNumberId,
  findByClientId,
  create,
  findAll,
  updateStatus,
  updateToken,
};