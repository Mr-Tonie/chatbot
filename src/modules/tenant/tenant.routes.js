const express = require('express');
const router = express.Router();
const controller = require('./tenant.controller');

router.get('/', controller.getAllTenants);
router.post('/', controller.createTenant);
router.put('/:clientId/status', controller.updateStatus);
router.patch('/:clientId/token', controller.updateToken);

module.exports = router;