import { Context } from 'koa';

import UserClaimsCache from '../caches/user-claims-cache';

export default (userClaimsCache: UserClaimsCache) => async (ctx: Context, next: () => void) => {
  ctx.state.userClaims = await userClaimsCache.getClaimsByHandle(ctx.state.handle);

  await next();
};