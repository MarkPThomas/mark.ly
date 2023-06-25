import { Context } from 'koa';

import IdentityApi from '../api-wrappers/identity';

export function redirect(ctx: Context): void {
  ctx.status = 307;
  ctx.redirect(`/id?redirectTo=${encodeURIComponent(ctx.originalUrl)}`);
}

export default (
  identityApi: IdentityApi,
  sessionCookieName: string,
  fallbackFn: (ctx: Context) => any,
) => {
  return async function (ctx: Context, next: () => void) {
    const sessionId = ctx.cookies.get(sessionCookieName) || ctx.request.get('Authorization');

    const session = await identityApi.getSession(sessionId);
    if (!session.isValid) {
      return fallbackFn(ctx);
    }

    ctx.state.handle = session.handle;

    await next();
  };
};