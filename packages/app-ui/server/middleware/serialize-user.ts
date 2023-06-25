import { Context, Next } from 'koa';

export default async (ctx: Context, next: Next): Promise<void> => {
  const user = {
    memberId: ctx.state.authorId,
    userHandle: ctx.state.userHandle || ctx.state.handle,
    claims: ctx.state.userClaims,
    features: ctx.state.userFeatures,
    personas: ctx.state.personas || []
  };
  ctx.request.headers['x-user'] = JSON.stringify(user);

  await next();
};