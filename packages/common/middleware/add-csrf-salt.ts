/* eslint-disable no-magic-numbers */
import { Context } from 'koa';

import { CSRF_SALT_HEADER_NAME } from '../utils/csrf/constants';

export default async (ctx: Context, next: () => void) => {
  const csrfSalt = Math.random().toString(36).slice(2);

  ctx.state.csrfSalt = csrfSalt;
  ctx.request.headers[CSRF_SALT_HEADER_NAME] = csrfSalt;

  await next();
};