import { Context } from 'koa';

import { CSRF_TOKEN_HEADER_NAME } from '../utils/csrf/constants';
import { Encrypter } from '../utils/encrypter';

export default async (ctx: Context, next: () => void) => {
  const encrypter = new Encrypter(ctx.state.handle, ctx.state.csrfSalt);
  ctx.request.headers[CSRF_TOKEN_HEADER_NAME] = encrypter.encrypt(ctx.state.authorId);

  await next();
};