import faker from 'community-faker';

import { CSRF_TOKEN_HEADER_NAME } from '../utils/csrf/constants';
import { Encrypter } from '../utils/encrypter';

import validateCsrfToken from './validate-csrf-token';

describe('#validate-csrf-token middleware', () => {
  let nextFnStub: jest.Mock;


  beforeEach(() => {
    nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());
  });

  it('should validate CSRF Token', async () => {
    const state = {
      csrfSalt: Math.random().toString(36).slice(2),
      userHandle: faker.datatype.uuid(),
      authorId: faker.datatype.uuid()
    };
    const ctx = {
      state,
      request: {
        headers: {
          [CSRF_TOKEN_HEADER_NAME]: new Encrypter(state.userHandle, state.csrfSalt).encrypt(state.authorId)
        }
      }
    } as any;
    await validateCsrfToken(ctx, nextFnStub);

    expect(nextFnStub).toHaveBeenCalled();
  });

  it('should throw error if CSRF token is missing', async () => {
    const state = {
      csrfSalt: Math.random().toString(36).slice(2),
      userHandle: faker.datatype.uuid(),
      authorId: faker.datatype.uuid()
    };

    const ctx = {
      state,
      request: {
        headers: {}
      }
    } as any;

    try {
      await validateCsrfToken(ctx, nextFnStub);
    } catch (e: any) {
      expect(e.message).toEqual('Cant find csrf token');
    }
  });

  it('should throw error if CSRF token is invalid', async () => {
    const state = {
      csrfSalt: Math.random().toString(36).slice(2),
      userHandle: faker.datatype.uuid(),
      authorId: faker.datatype.uuid()
    };

    const ctx = {
      state,
      request: {
        headers: {
          [CSRF_TOKEN_HEADER_NAME]: new Encrypter(state.userHandle, state.csrfSalt).encrypt(faker.datatype.uuid())
        }
      }
    } as any;

    try {
      await validateCsrfToken(ctx, nextFnStub);
    } catch (e: any) {
      expect(e.message).toEqual('Cant find csrf token');
    }
  });
});