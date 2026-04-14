/**
 * src/modules/whatsapp/webhook.routes.js
 */
const express = require('express');
const router = express.Router();
const controller = require('./webhook.controller');

router.get('/', controller.verifyWebhook);
router.post('/', controller.receiveMessage);

module.exports = router;