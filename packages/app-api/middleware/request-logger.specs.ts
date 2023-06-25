import { createMockContext } from '@shopify/jest-koa-mocks';

import { MOCK_UUID } from 'common/utils/csrf/mock';
import requestLogger from './request-logger';

jest.mock('common/utils/guid', () => {
  return function () {
    return MOCK_UUID;
  };
});

describe('Request logger', () => {
  let nextFnStub: jest.Mock;

  beforeAll(() => {
    nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());
  });

  it('should log latency of the request and add request it to the ctx', () => {
    const ctx = createMockContext();
    requestLogger(ctx, nextFnStub);

    expect(nextFnStub).toHaveBeenCalled();
    expect(ctx.state.requestId).toEqual(MOCK_UUID);
  });
});