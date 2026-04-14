/**
 * src/modules/chatbot/flows/support.flow.js
 */
const { FLOWS, STEPS } = require('../../../utils/constants');

const handleSupportFlow = (text, state) => {
  switch (state.step) {

    case STEPS.ASK_ISSUE:
      return {
        reply: 'Please describe your issue in as much detail as possible:',
        nextState: { ...state, step: STEPS.SAVE_ISSUE },
      };

    case STEPS.SAVE_ISSUE: {
      const ticketRef = `SUP-${Date.now().toString().slice(-5)}`;
      return {
        reply:
          `Got it! We have logged your issue:\n\n` +
          `"${text}"\n\n` +
          `Reference: #${ticketRef}\n\n` +
          `A support agent will follow up shortly.\n` +
          `Type *hi* to return to the main menu.`,
        nextState: { flow: FLOWS.WELCOME, step: STEPS.START, context: {} },
      };
    }

    default:
      return {
        reply: 'Please describe your issue:',
        nextState: { ...state, step: STEPS.SAVE_ISSUE },
      };
  }
};

module.exports = { handleSupportFlow };