/**
 * src/modules/tenant/tenant.routes.js
 */
const express = require('express');
const router = express.Router();
const controller = require('./tenant.controller');

router.get('/', controller.getAllTenants);
router.post('/', controller.createTenant);
router.put('/:clientId/status', controller.updateStatus);

module.exports = router;