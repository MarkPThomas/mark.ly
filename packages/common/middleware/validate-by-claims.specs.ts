import { lorem, unique } from 'community-faker';
import { createMockContext } from '@shopify/jest-koa-mocks';

import validateByClaims from './validate-by-claims';

describe('#validate-by-claims middleware', () => {
  let nextFnStub: jest.Mock;
  const ALLOWED_CLAIMS = [unique(lorem.word)];
  const fallbackFn = jest.fn();
  beforeEach(() => {
    nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());
  });
  it('should call fallback fn if claims are not valid', async () => {
    const invalidUserClaims = [unique(lorem.word)];

    const ctx = createMockContext({ state: { userClaims: invalidUserClaims } });
    await validateByClaims(ALLOWED_CLAIMS, fallbackFn)(ctx, nextFnStub);

    expect(nextFnStub).toBeCalledTimes(0);
    expect(fallbackFn).toBeCalled();
  });
  it('should call nextFn if claims are valid', async () => {
    const ctx = createMockContext({ state: { userClaims: ALLOWED_CLAIMS } });
    await validateByClaims(ALLOWED_CLAIMS, fallbackFn)(ctx, nextFnStub);

    expect(nextFnStub).toHaveBeenCalled();
  });
  it('should call function for getting claims and nextFn if claims are valid', async () => {
    const ctx = createMockContext();
    const getClaimsFn = jest.fn().mockReturnValue(ALLOWED_CLAIMS);

    await validateByClaims(ALLOWED_CLAIMS, fallbackFn, getClaimsFn)(ctx, nextFnStub);

    expect(getClaimsFn).toHaveBeenCalled();
    expect(nextFnStub).toHaveBeenCalled();
  });
});