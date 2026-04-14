/**
 * src/modules/crm/contact.routes.js
 */
const express = require('express');
const router = express.Router();
const controller = require('./contact.controller');

router.get('/', controller.getAllContacts);
router.get('/:phone', controller.getContact);
router.put('/:phone/tag', controller.addTag);
router.delete('/:phone/tag', controller.removeTag);
router.put('/:phone/note', controller.updateNote);
router.put('/:phone/stage', controller.updateStage);

module.exports = router;