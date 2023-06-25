import { Context } from 'koa';

export default (
  allowedClaims: string[],
  fallbackFn: (ctx: Context) => any,
  claimsSelector?: (ctx: Context) => string[]
) => async (ctx: Context, next: () => Promise<void>) => {

  const userClaims: string[] =
    claimsSelector && typeof claimsSelector === 'function' ? claimsSelector(ctx) : ctx.state.userClaims;

  if (!userClaims.some(claim => allowedClaims.includes(claim))) {
    return fallbackFn(ctx);
  }

  await next();
};