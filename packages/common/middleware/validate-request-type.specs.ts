import validateRequestType from './validate-request-type';

describe('#validate-request-type', () => {
  let nextFnStub: jest.Mock;
  beforeEach(() => {
    nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());
  });

  it('should not throw error for application/json content type', async () => {
    await validateRequestType(
      {
        request: {
          type: 'application/json'
        }
      } as any,
      nextFnStub
    );

    expect(nextFnStub).toHaveBeenCalled();
  });

  it('should not throw error for multipart/form-data content type', async () => {
    await validateRequestType(
      {
        request: {
          type: 'multipart/form-data'
        }
      } as any,
      nextFnStub
    );

    expect(nextFnStub).toHaveBeenCalled();
  });

  it('should throw error when request type is not valid', async () => {
    try {
      await validateRequestType({ request: { type: 'application/javascript' } } as any, nextFnStub);
    } catch (e: any) {
      expect(e.message).toEqual('NotAcceptable');
    }
  });
});