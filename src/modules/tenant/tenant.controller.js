/**
 * src/modules/tenant/tenant.controller.js
 * HTTP LAYER only.
 * Access token is NEVER returned in any response.
 */
const tenantService = require('./tenant.service');

// Strip sensitive fields before sending to client
const sanitize = (tenant) => {
  const obj = typeof tenant.toObject === 'function' ? tenant.toObject() : { ...tenant };
  if (obj.whatsapp) {
    delete obj.whatsapp.accessToken;
  }
  return obj;
};

const getAllTenants = async (req, res, next) => {
  try {
    const tenants = await tenantService.getAllTenants();
    res.status(200).json({
      success: true,
      count: tenants.length,
      data: tenants.map(sanitize),
    });
  } catch (err) { next(err); }
};

const createTenant = async (req, res, next) => {
  try {
    const tenant = await tenantService.createTenant(req.body);
    res.status(201).json({ success: true, data: sanitize(tenant) });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { status } = req.body;
    const tenant = await tenantService.updateStatus(clientId, status);
    res.status(200).json({ success: true, data: sanitize(tenant) });
  } catch (err) { next(err); }
};

module.exports = { getAllTenants, createTenant, updateStatus };