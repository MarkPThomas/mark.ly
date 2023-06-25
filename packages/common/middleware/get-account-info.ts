import { Context } from 'koa';

import AccountCache from '../caches/account-cache';

export default (
  accountCache: AccountCache,
  mapFn?: (ctx: Context, user: { firstName: string; lastName: string; email: string }) => void
) => {
  return async function (ctx: Context, next: () => void) {
    const { firstName, email, lastName } = await accountCache.getAccount(ctx.state.handle);

    if (mapFn && typeof mapFn === 'function') {
      mapFn(ctx, { firstName, email, lastName });
    } else {
      ctx.state.firstName = firstName;
      ctx.state.lastName = lastName;
      ctx.state.email = email;
    }

    await next();
  };
};