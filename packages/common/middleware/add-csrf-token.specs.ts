import { datatype } from 'community-faker';

import { CSRF_TOKEN_HEADER_NAME } from '../utils/csrf/constants';
import { Encrypter } from '../utils/encrypter';

import addCsrfToken from './add-csrf-token';

describe('#add-csrf-token middleware', () => {
  let nextFnStub: jest.Mock;

  beforeEach(() => {
    nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());
    Encrypter.prototype.encrypt = jest.fn().mockResolvedValue(undefined);
  });

  it('should add CSRF token to headers', async () => {
    const ctx = {
      state: {
        csrfSalt: Math.random().toString(36).slice(2),
        handle: datatype.uuid(),
        authorId: datatype.uuid()
      },
      request: {
        headers: {}
      }
    } as any;
    await addCsrfToken(ctx, nextFnStub);

    expect(nextFnStub).toHaveBeenCalled();
    expect(Encrypter.prototype.encrypt).toHaveBeenCalled();

    expect(ctx.request.headers).toHaveProperty(CSRF_TOKEN_HEADER_NAME);
    expect(ctx.request.headers[CSRF_TOKEN_HEADER_NAME]).toEqual(
      new Encrypter(ctx.state.handle, ctx.state.csrfSalt).encrypt(ctx.state.authorId)
    );
  });
});