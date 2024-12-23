import { defineAuth } from '@aws-amplify/backend';
import { messageHandler } from './message';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  triggers: {
    customMessage: messageHandler
  }
});