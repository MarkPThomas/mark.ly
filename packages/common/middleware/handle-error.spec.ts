import { datatype, lorem } from 'community-faker';
import { createMockContext } from '@shopify/jest-koa-mocks';

import handleError from './handle-error';

describe('#handle-error middleware', () => {
  let nextFnStub: jest.Mock;
  let loggerStub: { error: jest.Mock };

  const requestIdMock = datatype.uuid();
  const errorMock = { message: lorem.word(), status: 400 };
  beforeEach(() => {
    nextFnStub = jest.fn().mockRejectedValueOnce(errorMock);
    loggerStub = { error: jest.fn() };
  });

  it('should call logger and add error details to the context', async () => {
    const ctx = createMockContext({ state: { requestId: requestIdMock } });
    await handleError({ logger: loggerStub as any })(ctx, nextFnStub);

    expect(nextFnStub).toHaveBeenCalled();
    expect(loggerStub.error).toHaveBeenCalledWith(
      {
        message: 'Koa handle-error middleware.',
        layer: 'MIDDLEWARE',
        payload: {
          requestId: requestIdMock,
          request: JSON.stringify(ctx.request)
        },
        errorMessage: JSON.stringify(errorMock)
      },
      errorMock
    );

    expect(ctx.body).toEqual(errorMock.message);
    expect(ctx.status).toEqual(errorMock.status);
  });
});