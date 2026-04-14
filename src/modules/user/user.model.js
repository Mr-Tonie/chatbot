/**
 * src/modules/user/user.model.js
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    clientId: { type: String, required: true },
    name: { type: String, default: null },
    tags: { type: [String], default: [] },
    notes: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ phone: 1, clientId: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);