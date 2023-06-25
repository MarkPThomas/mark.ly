import memberRepo from 'common/database/repositories-orm/member';
import { HttpForbidden, HttpNotFound } from 'common/errors/http';
import { Context, Next } from 'koa';

import config from '../config';

export default async (ctx: Context, next: Next): Promise<void> => {
  const memberId = ctx.cookies.get('x-member-id');
  if (ctx.state.userClaims.includes(config.claim) && memberId) {
    const member = await memberRepo().find(memberId);

    if (!member) throw new HttpNotFound('No member found by member id');

    ctx.state.handle = member.userHandle || ctx.state.handle;
  }

  if (!ctx.state.userClaims.some((claim) => config.allowedClaims.includes(claim))) {
    throw new HttpForbidden("You can't access this data");
  }

  const handle = ctx.state.handle;
  const claims = ctx.state.userClaims || [];

  ctx.state.userFeatures = await ctx.ldClient.allFeaturesState({ key: handle, custom: { claims } });

  const member = await memberRepo().findBy({ where: { userHandle: ctx.state.handle } });

  if (!member) {
    throw new HttpForbidden('Forbidden');
  }
  ctx.state.memberId = member.id;

  await next();
};