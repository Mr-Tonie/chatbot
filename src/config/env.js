/**
 * src/config/env.js
 */
require('dotenv').config();

const _required = (key) => {
  if (!process.env[key]) {
    console.error(`[CONFIG] ❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
  return process.env[key];
};

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  whatsapp: {
    verifyToken: _required('WHATSAPP_VERIFY_TOKEN'),
    accessToken: _required('WHATSAPP_ACCESS_TOKEN'),
    phoneNumberId: _required('WHATSAPP_PHONE_NUMBER_ID'),
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v18.0',
  },

  tenant: {
    defaultClientId: process.env.DEFAULT_CLIENT_ID || 'client_demo',
  },
};