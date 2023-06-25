import { datatype, name, internet } from 'community-faker';
import { createMockContext } from '@shopify/jest-koa-mocks';

import IdentityApi from '../api-wrappers/identity';
import AccountCache from '../caches/account-cache';

import getAccountInfo from './get-account-info';

jest.mock('../api-wrappers/identity');

describe('#get-account-info middleware', () => {
  let nextFnStub: jest.Mock;
  let accountCache: AccountCache;
  const accountMock = {
    firstName: name.firstName(),
    lastName: name.lastName(),
    email: internet.email()
  };
  const accountRepoMock = {
    find: jest.fn().mockResolvedValue(undefined),
    save: jest.fn().mockResolvedValue(undefined)
  };

  beforeEach(() => {
    nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());

    const identityApi = new IdentityApi({ apiKey: datatype.uuid(), apiUrl: internet.url() });
    accountCache = new AccountCache(identityApi);
    accountCache.getRepo = jest.fn().mockImplementation(() => accountRepoMock);

    jest.spyOn(accountCache, 'getAccount').mockResolvedValue(accountMock);
  });

  it('should add account info to the context state', async () => {
    const ctx = createMockContext();

    await getAccountInfo(accountCache)(ctx, nextFnStub);

    expect(nextFnStub).toHaveBeenCalled();
    expect(accountCache.getAccount).toHaveBeenCalled();

    expect(ctx.state).toHaveProperty('firstName');
    expect(ctx.state).toHaveProperty('lastName');
    expect(ctx.state).toHaveProperty('email');

    expect(ctx.state.firstName).toEqual(accountMock.firstName);
    expect(ctx.state.lastName).toEqual(accountMock.lastName);
    expect(ctx.state.email).toEqual(accountMock.email);
  });

  it('should call map function', async () => {
    const ctx = createMockContext();
    const mapFnStub = jest.fn();
    await getAccountInfo(accountCache, mapFnStub)(ctx, nextFnStub);

    expect(mapFnStub).toHaveBeenCalled();
    expect(nextFnStub).toHaveBeenCalled();
    expect(accountCache.getAccount).toHaveBeenCalled();
  });
});