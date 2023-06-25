import { datatype, lorem, internet } from 'community-faker';
import { createMockContext } from '@shopify/jest-koa-mocks';

import IdentityApi, { InvalidSession, ValidSession } from '../api-wrappers/identity';
import authenticateSession from './authenticate-session';

describe('#authenticate-session middleware', () => {
  const sessionCookieName = lorem.word().toLocaleLowerCase();

  describe('When session is valid', () => {
    let nextFnStub: jest.Mock;
    const identityApi = new IdentityApi({ apiUrl: internet.url(), apiKey: lorem.word().toLocaleLowerCase() });

    const validSessionResponse: ValidSession = {
      isValid: true,
      id: datatype.uuid(),
      handle: datatype.uuid(),
      impersonatorHandle: datatype.uuid(),
      creationDate: new Date().toISOString()
    };

    beforeEach(() => {
      nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());

      jest.spyOn(identityApi, 'getSession').mockResolvedValueOnce(validSessionResponse);
    });

    it('should get sessionId from cookies, identify valid session and add handle to state', async () => {
      const ctx = createMockContext({
        cookies: {
          [sessionCookieName]: datatype.uuid()
        }
      });

      const errorCallback = jest.fn();
      await authenticateSession(identityApi, sessionCookieName, errorCallback)(ctx, nextFnStub);

      expect(nextFnStub).toHaveBeenCalled();
      expect(errorCallback).toBeCalledTimes(0);
      expect(ctx.state).toHaveProperty('handle');
      expect(ctx.state.handle).toEqual(validSessionResponse.handle);
    });

    it('should get sessionId from cookies, identify valid session and add handle to state', async () => {
      const ctx = createMockContext({
        headers: {
          Authorization: datatype.uuid()
        }
      });
      const errorCallback = jest.fn();
      await authenticateSession(identityApi, sessionCookieName, errorCallback)(ctx, nextFnStub);

      expect(nextFnStub).toHaveBeenCalled();
      expect(errorCallback).toBeCalledTimes(0);
      expect(ctx.state).toHaveProperty('handle');
      expect(ctx.state.handle).toEqual(validSessionResponse.handle);
    });
  });

  describe('When session is not valid', () => {
    let nextFnStub: jest.Mock;
    const identityApi = new IdentityApi({ apiUrl: internet.url(), apiKey: lorem.word().toLocaleLowerCase() });
    const invalidSessionResponse: InvalidSession = {
      isValid: false,
      error: lorem.words(3)
    };

    beforeEach(() => {
      nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());
      jest.spyOn(identityApi, 'getSession').mockResolvedValueOnce(invalidSessionResponse);
    });

    it('should throw Forbidden error if session is not valid', async () => {
      const ctx = createMockContext({
        cookies: {
          [sessionCookieName]: datatype.uuid()
        }
      });

      authenticateSession(identityApi, sessionCookieName, jest.fn())(ctx, nextFnStub);

      expect(nextFnStub).toBeCalledTimes(0);
    });
  });

  describe('When session id is not exists', () => {
    let nextFnStub: jest.Mock;
    const identityApi = new IdentityApi({ apiUrl: internet.url(), apiKey: lorem.word().toLocaleLowerCase() });
    const invalidSessionResponse: InvalidSession = {
      isValid: false,
      error: lorem.words(3)
    };

    beforeEach(() => {
      nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());
      jest.spyOn(identityApi, 'getSession').mockResolvedValueOnce(invalidSessionResponse);
    });

    it('should throw Forbidden error if session cookie is not exists', async () => {
      const ctx = createMockContext({
        state: {}
      });
      authenticateSession(identityApi, sessionCookieName, jest.fn())(ctx, nextFnStub);

      expect(nextFnStub).toBeCalledTimes(0);
    });
  });
});