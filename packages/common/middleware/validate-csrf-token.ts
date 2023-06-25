import { Context } from 'koa';

import { HttpForbidden } from '../errors/http';
import { CSRF_TOKEN_HEADER_NAME, CSRF_SALT_HEADER_NAME } from '../utils/csrf/constants';
import { Encrypter } from '../utils/encrypter';

export default async (ctx: Context, next: () => void) => {
  const encrypter = new Encrypter(
    ctx.state.userHandle,
    ctx.state.csrfSalt || ctx.request.headers[CSRF_SALT_HEADER_NAME]
  );

  const csrfToken = ctx.request.headers[CSRF_TOKEN_HEADER_NAME] as any;
  if (!csrfToken || encrypter.decrypt(csrfToken as string) !== ctx.state.authorId) {
    throw new HttpForbidden('Cant find csrf token');
  }

  await next();
};