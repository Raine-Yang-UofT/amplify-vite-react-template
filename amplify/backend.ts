import { defineBackend } from '@aws-amplify/backend';
import { auth, customMessage } from './auth/resource';
import { data } from './data/resource';

defineBackend({
  auth,
  data,
  customMessage,
});
