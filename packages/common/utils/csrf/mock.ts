/* eslint-disable no-magic-numbers */
import { Encrypter } from '../encrypter';

export const generateCsrfSalt = (): string => Math.random().toString(36).slice(2);

export const generateCsrfToken = (user: any, salt?: string): string => {
  return new Encrypter(user.handle || user.userHandle, salt || generateCsrfSalt()).encrypt(user.userId);
};

export const MOCK_UUID = '73f63ffc-c9e8-4d82-9bb8-178f382a1e74';

export const INVALID_SESSION_ID = 'invalid-session-id';