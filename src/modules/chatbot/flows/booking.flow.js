/**
 * src/modules/chatbot/flows/booking.flow.js
 */
const { FLOWS, STEPS } = require('../../../utils/constants');

const handleBookingFlow = (text, state) => {
  switch (state.step) {

    case STEPS.ASK_NAME:
      return {
        reply: '👤 What is your full name?',
        nextState: { ...state, step: STEPS.SAVE_NAME },
      };

    case STEPS.SAVE_NAME:
      return {
        reply: `📅 Thanks *${text}*! What date works for you?\n\nFormat: DD/MM/YYYY`,
        nextState: {
          ...state,
          step: STEPS.SAVE_DATE,
          context: { ...state.context, name: text },
        },
      };

    case STEPS.SAVE_DATE:
      return {
        reply:
          `🔧 What service do you need?\n\n` +
          `1️⃣  Consultation\n` +
          `2️⃣  Installation\n` +
          `3️⃣  Repair\n\n` +
          `Reply *1*, *2*, or *3*`,
        nextState: {
          ...state,
          step: STEPS.SAVE_SERVICE,
          context: { ...state.context, date: text },
        },
      };

    case STEPS.SAVE_SERVICE: {
      const services = { '1': 'Consultation', '2': 'Installation', '3': 'Repair' };
      const service = services[text] || text;

      return {
        reply:
          `✅ *Booking Summary*\n\n` +
          `👤 Name:    ${state.context.name}\n` +
          `📅 Date:    ${state.context.date}\n` +
          `🔧 Service: ${service}\n\n` +
          `Confirm? Reply *YES* or *NO*`,
        nextState: {
          ...state,
          step: STEPS.CONFIRM,
          context: { ...state.context, service },
        },
      };
    }

    case STEPS.CONFIRM:
      if (text.toUpperCase() === 'YES') {
        return {
          reply:
            `🎉 Booking confirmed!\n\n` +
            `We will see you on *${state.context.date}*.\n` +
            `You will receive a reminder 24 hours before.\n\n` +
            `Type *hi* to return to the main menu.`,
          nextState: { flow: FLOWS.WELCOME, step: STEPS.START, context: {} },
        };
      }
      return {
        reply: '❌ Booking cancelled. Type *hi* to start again.',
        nextState: { flow: FLOWS.WELCOME, step: STEPS.START, context: {} },
      };

    default:
      return {
        reply: '👤 What is your full name?',
        nextState: { ...state, step: STEPS.SAVE_NAME },
      };
  }
};

module.exports = { handleBookingFlow };