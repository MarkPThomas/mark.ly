import { datatype, lorem } from 'community-faker';
import { createMockContext } from '@shopify/jest-koa-mocks';

import UserClaimsCache from '../caches/user-claims-cache';
import getUserClaims from './get-user-claims';

describe('#get-user-claims middleware', () => {
  let nextFnStub: jest.Mock;

  const USER_CLAIMS_MOCK = [lorem.word()];
  const userClaimsCache = new UserClaimsCache({} as any);
  const HANDLE_MOCK = datatype.uuid();
  beforeEach(() => {
    nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());
    jest
      .spyOn(userClaimsCache, 'getClaimsByHandle')
      .mockResolvedValue(USER_CLAIMS_MOCK);
  });

  it('should add user claims to the state', async () => {
    const ctx = createMockContext({ state: { handle: HANDLE_MOCK } });

    await getUserClaims(userClaimsCache)(ctx, nextFnStub);

    expect(userClaimsCache.getClaimsByHandle).toBeCalled();
    expect(nextFnStub).toBeCalled();
    expect(ctx.state.userClaims).toEqual(USER_CLAIMS_MOCK);
  });
});