/**
 * src/routes/index.js
 */
const express = require('express');
const router = express.Router();

router.use('/webhook', require('../modules/whatsapp/webhook.routes'));
router.use('/crm/contacts', require('../modules/crm/contact.routes'));
router.use('/tenants', require('../modules/tenant/tenant.routes'));

module.exports = router;