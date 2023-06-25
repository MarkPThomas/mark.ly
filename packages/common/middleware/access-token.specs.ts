import { Context } from 'koa';
import { datatype, lorem } from 'community-faker';
import { createMockContext } from '@shopify/jest-koa-mocks';

import accessTokenRepo from '../database/repositories-orm/access-token';

import { createAuthMiddleware, createTokenController } from './access-token';

jest.mock('../db/repositories-orm/access-token');

describe('#access-token middlewares', () => {
  describe('#createAuthMiddleware', () => {
    let nextFnStub: jest.Mock;
    let ctx: Context;

    const authTokenMock = datatype.uuid();
    const mockUserHandle = datatype.uuid();
    const findOneMock = {
      findOne: jest
        .fn()
        .mockResolvedValueOnce({
          client: mockUserHandle
        })
        .mockReturnValue(undefined)
    };
    beforeAll(() => {
      (accessTokenRepo as jest.Mock).mockReturnValue(findOneMock);
    });
    beforeEach(() => {
      ctx = createMockContext({ headers: { Authorization: authTokenMock } });
      nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());
    });
    it('should add handle to the context', async () => {
      const serviceName = lorem.word();

      await createAuthMiddleware({ service: serviceName })(ctx, nextFnStub);

      expect(nextFnStub).toBeCalled();
      expect(findOneMock.findOne).toBeCalledWith({ where: { token: authTokenMock, issuedBy: serviceName } });
      expect(ctx.handle).toEqual(mockUserHandle);
    });
    it('should should throw 403 error of client is missing', async () => {
      jest.spyOn(ctx, 'throw');

      await createAuthMiddleware({ service: lorem.word() })(ctx, nextFnStub);

      const EXPECTED_ERROR_CODE = 403;

      expect(nextFnStub).toBeCalledTimes(0);
      expect(ctx.throw).toBeCalledWith(EXPECTED_ERROR_CODE, `Invalid access token: ${authTokenMock}`);
    });
  });
  describe('#createTokenController', () => {
    const clientMock = datatype.uuid();
    const clientTokenMock = datatype.uuid();
    const newClientTokenMock = datatype.uuid();
    const serviceNameMock = lorem.word();

    const accessTokenRepoMock = {
      save: jest.fn().mockResolvedValue({
        token: newClientTokenMock
      }),
      findOne: jest
        .fn()
        .mockResolvedValueOnce({
          token: clientTokenMock
        })
        .mockReturnValue(undefined)
    };

    const ctx = createMockContext({ requestBody: { client: clientMock } });

    beforeAll(() => {
      (accessTokenRepo as jest.Mock).mockReturnValue(accessTokenRepoMock);
    });

    it('should add existent token to the ctx body', async () => {
      await createTokenController({ service: serviceNameMock })(ctx);

      expect(accessTokenRepoMock.findOne).toBeCalledWith({
        where: { client: clientMock, issuedBy: serviceNameMock }
      });

      expect(ctx.body).toEqual({ token: clientTokenMock });
    });

    it('should add new token to the ctx body', async () => {
      await createTokenController({ service: serviceNameMock })(ctx);

      expect(accessTokenRepoMock.findOne).toBeCalledWith({
        where: { client: clientMock, issuedBy: serviceNameMock }
      });
      expect(accessTokenRepoMock.save).toBeCalled();

      expect(ctx.body).toEqual({ token: newClientTokenMock });
    });

    it('should throw error if client is missing in the ctx body', async () => {
      const ctx = createMockContext({ requestBody: {} });

      jest.spyOn(ctx, 'throw');

      await createTokenController({ service: lorem.word() })(ctx);

      const EXPECTED_ERROR_CODE = 400;

      expect(ctx.throw).toBeCalledWith(EXPECTED_ERROR_CODE, 'client required');
    });
  });
});