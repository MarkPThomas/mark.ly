import addCsrfSalt from './add-csrf-salt';

describe('#add-csrf-salt middleware', () => {
  let nextFnStub: jest.Mock;
  beforeEach(() => {
    nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());
  });

  it('should add csrf salt to the ctx state', async () => {
    const ctx = {
      state: {},
      request: { headers: {} }
    };
    await addCsrfSalt(ctx as any, nextFnStub);

    expect(nextFnStub).toHaveBeenCalled();
    expect(ctx.state).toHaveProperty('csrfSalt');
    expect((ctx.state as any).csrfSalt).toBeDefined();
  });
});