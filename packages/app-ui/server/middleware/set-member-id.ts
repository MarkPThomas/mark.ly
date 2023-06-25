import UserClaimsCache from 'common/caches/user-claims-cache';
import memberRepo from 'common/database/repositories-orm/member';
import { NextFunction } from 'connect';
import { Context } from 'koa';

import renderNoMember from './renderNoMember';

const NOT_FOUND_ERROR_CODE = 404;

export default (userClaimsCache: UserClaimsCache) =>
  async function (ctx: Context, next: NextFunction): Promise<void> {
    const memberId = ctx.request.query.memberId as string;
    const claim = ctx.request.query.claim; //  user | both ; default: author
    const claims = ctx.state.userClaims || [];

    if (memberId && claims.includes('claim')) {
      const member = await memberRepo().find(memberId);
      if (!member) {
        return ctx.throw(NOT_FOUND_ERROR_CODE, `Member with "${memberId}" id not found`);
      }

      if (claim === 'user') {
        ctx.state.userClaims = claims;
        ctx.cookies.set('x-member-id', memberId, { httpOnly: true, sameSite: 'lax' });
        ctx.state.userFeatures = await ctx.ldClient.allFeaturesState({
          key: member.userHandle,
          custom: { claims }
        });
      } else if (claim === 'both') {
        const memberClaims = await userClaimsCache.getClaimsByHandle(member.userHandle);
        ctx.state.userClaims = [...claims, ...memberClaims];

        ctx.cookies.set('x-member-id', memberId, { httpOnly: true, sameSite: 'lax' });
        ctx.state.userFeatures = await ctx.ldClient.allFeaturesState({
          key: member.userHandle,
          custom: { claims: ctx.state.userClaims }
        });
      } else {
        const memberClaims = await userClaimsCache.getClaimsByHandle(member.userHandle);
        ctx.state.userClaims = memberClaims;

        ctx.cookies.set('x-member-id', memberId, { httpOnly: true, sameSite: 'lax' });
        ctx.state.userFeatures = await ctx.ldClient.allFeaturesState({
          key: member.userHandle,
          custom: { claims: memberClaims }
        });
      }

      ctx.state.memberId = member.id;
      ctx.state.handle = member.userHandle;

      return next();
    }

    ctx.cookies.set('x-member-id');

    const member = await memberRepo().findBy({ where: { userHandle: ctx.state.handle } });
    if (!member) {
      return renderNoMember(ctx);
    }

    ctx.state.memberId = member.id;

    await next();
  };