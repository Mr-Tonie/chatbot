/**
 * src/modules/tenant/tenant.model.js
 */
const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: null },

    whatsapp: {
      phoneNumberId: { type: String, required: true },
      accessToken: { type: String, required: true },
    },

    config: {
      welcomeMessage: {
        type: String,
        default: 'Hello! Welcome. How can I help you today?',
      },
      supportEmail: { type: String, default: null },
      businessHours: {
        start: { type: String, default: '08:00' },
        end: { type: String, default: '17:00' },
      },
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// clientId already has unique:true above — no duplicate index needed
// UNIQUE — one phone number = one tenant, no exceptions
tenantSchema.index({ 'whatsapp.phoneNumberId': 1 }, { unique: true });

module.exports = mongoose.model('Tenant', tenantSchema);