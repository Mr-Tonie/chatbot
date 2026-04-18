const tenantRepository = require('./tenant.repository');
const logger = require('../../utils/logger');

const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if ((now - value.cachedAt) > CACHE_TTL) {
      cache.delete(key);
      logger.debug(`[TenantService] Cache evicted: ${key}`);
    }
  }
}, CACHE_TTL);

const resolveByPhoneNumberId = async (phoneNumberId) => {
  const cached = cache.get(phoneNumberId);
  if (cached && (Date.now() - cached.cachedAt) < CACHE_TTL) {
    logger.debug(`[TenantService] Cache hit: ${phoneNumberId}`);
    return cached.tenant;
  }

  const tenant = await tenantRepository.findByPhoneNumberId(phoneNumberId);

  if (!tenant) {
    logger.error(`[TenantService] No tenant for phoneNumberId: ${phoneNumberId} — message dropped`);
    return null;
  }

  if (tenant.status !== 'active') {
    logger.warn(`[TenantService] Tenant ${tenant.clientId} is ${tenant.status} — message dropped`);
    return null;
  }

  cache.set(phoneNumberId, { tenant, cachedAt: Date.now() });
  return tenant;
};

const createTenant = async (data) => {
  const required = ['clientId', 'name', 'email', 'whatsapp'];
  for (const field of required) {
    if (!data[field]) {
      const err = new Error(`Missing required field: ${field}`);
      err.statusCode = 400;
      throw err;
    }
  }
  if (!data.whatsapp.phoneNumberId || !data.whatsapp.accessToken) {
    const err = new Error('whatsapp.phoneNumberId and whatsapp.accessToken are required');
    err.statusCode = 400;
    throw err;
  }
  const tenant = await tenantRepository.create(data);
  logger.info(`[TenantService] Onboarded: ${tenant.clientId}`);
  return tenant;
};

const getAllTenants = async () => {
  return await tenantRepository.findAll();
};

const updateStatus = async (clientId, status) => {
  const valid = ['active', 'inactive', 'suspended'];
  if (!valid.includes(status)) {
    const err = new Error(`Invalid status. Must be one of: ${valid.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }
  const tenant = await tenantRepository.updateStatus(clientId, status);
  if (!tenant) {
    const err = new Error(`Tenant not found: ${clientId}`);
    err.statusCode = 404;
    throw err;
  }
  cache.delete(tenant.whatsapp?.phoneNumberId);
  logger.info(`[TenantService] ${clientId} status → ${status}`);
  return tenant;
};

const updateToken = async (clientId, accessToken) => {
  const tenant = await tenantRepository.updateToken(clientId, accessToken);
  if (!tenant) {
    const err = new Error(`Tenant not found: ${clientId}`);
    err.statusCode = 404;
    throw err;
  }
  cache.delete(tenant.whatsapp?.phoneNumberId);
  logger.info(`[TenantService] Token updated for: ${clientId}`);
  return tenant;
};

module.exports = {
  resolveByPhoneNumberId,
  createTenant,
  getAllTenants,
  updateStatus,
  updateToken,
};