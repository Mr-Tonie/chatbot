/**
 * src/modules/message/message.model.js
 */
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    phone: { type: String, required: true },
    direction: { type: String, enum: ['incoming', 'outgoing'], required: true },
    type: { type: String, default: 'text' },
    text: { type: String, default: null },
    flow: { type: String, default: null },
    step: { type: String, default: null },
    status: { type: String, default: 'sent' },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ userId: 1, createdAt: -1 });
messageSchema.index({ clientId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);