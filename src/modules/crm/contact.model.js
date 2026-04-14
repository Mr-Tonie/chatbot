/**
 * src/modules/crm/contact.model.js
 *
 * CRM view of a user.
 * Reuses the User model — adds CRM-specific fields on top.
 * We do NOT create a separate collection — CRM data lives on the User document.
 * This keeps queries simple and avoids joins.
 */
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    clientId: { type: String, required: true },
    name: { type: String, default: null },

    // CRM fields
    tags: { type: [String], default: [] },
    notes: { type: String, default: null },
    stage: {
      type: String,
      enum: ['new', 'lead', 'customer', 'vip', 'inactive'],
      default: 'new',
    },

    // Computed from messages — updated on each interaction
    lastSeenAt: { type: Date, default: null },
    messageCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

contactSchema.index({ phone: 1, clientId: 1 }, { unique: true });
contactSchema.index({ clientId: 1, stage: 1 });
contactSchema.index({ clientId: 1, tags: 1 });

module.exports = mongoose.model('Contact', contactSchema);