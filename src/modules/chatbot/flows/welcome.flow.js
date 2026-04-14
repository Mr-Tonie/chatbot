/**
 * src/modules/chatbot/flows/welcome.flow.js
 */
const { FLOWS, STEPS } = require('../../../utils/constants');

const MENU = `Please choose an option:

1️⃣  Book an appointment
2️⃣  Customer support
3️⃣  Talk to a human

Reply with *1*, *2*, or *3*`;

const handleWelcomeFlow = (text, state) => {
  switch (state.step) {

    case STEPS.START:
      return {
        reply: `👋 Hello! Welcome.\n\n${MENU}`,
        nextState: { flow: FLOWS.WELCOME, step: STEPS.MENU },
      };

    case STEPS.MENU: {
      const choice = text.trim();

      if (choice === '1') {
        return {
          reply: 'Great! Let\'s book your appointment.',
          nextState: { flow: FLOWS.BOOKING, step: STEPS.ASK_NAME },
        };
      }
      if (choice === '2') {
        return {
          reply: 'I\'ll connect you to support now.',
          nextState: { flow: FLOWS.SUPPORT, step: STEPS.ASK_ISSUE },
        };
      }
      if (choice === '3') {
        return {
          reply: 'Please hold — a team member will be with you shortly.',
          nextState: { flow: FLOWS.WELCOME, step: STEPS.WAITING_HUMAN },
        };
      }

      return {
        reply: `Invalid option. Please reply *1*, *2*, or *3*.\n\n${MENU}`,
        nextState: { flow: FLOWS.WELCOME, step: STEPS.MENU },
      };
    }

    case STEPS.WAITING_HUMAN:
      return {
        reply: 'You are already in the queue. A human agent will respond shortly.',
        nextState: state,
      };

    default:
      return {
        reply: `Hello!\n\n${MENU}`,
        nextState: { flow: FLOWS.WELCOME, step: STEPS.MENU },
      };
  }
};

module.exports = { handleWelcomeFlow };