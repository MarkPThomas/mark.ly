// import IdentityApi from 'common/api-wrappers/identity';
// import AccountCache from 'common/caches/account-cache';
// import UserClaimCache from 'common/caches/user-claims-cache';
// import authenticateSession, { redirect as unauthorizedRedirect } from 'common/middleware/authenticate-session';
// import getAccountInfoByHandle from 'common/middleware/get-account-info';
// import getUserClaims from 'common/middleware/get-user-claims';
// import validateEmployeeClaimsForRequest from 'common/middleware/validate-by-claims';

import Router from 'koa-router';

import config from '../config';
// import renderNoMember from '../middleware/renderNoMember';
import setMemberId from '../middleware/set-member-id';

import home from './home';
import noMatch from './no-match';

// const identityApi = new IdentityApi({ apiUrl: config.identity.apiUrl, apiKey: config.identity.apiKey });
// const userClaimsCache = new UserClaimCache(identityApi);

const router = new Router<never, never>({ prefix: config.client.basePath });
router
  // .use(authenticateSession(identityApi, config.identity.sessionCookieName, unauthorizedRedirect))
  // .use(getUserClaims(userClaimsCache))
  // .use(validateEmployeeClaimsForRequest(config.allowedClaims, renderNoMember))
  // .use(getAccountInfoByHandle(new AccountCache(identityApi)))
  // .use(setMemberId(userClaimsCache))
  .use(home.routes())
  .use(noMatch.routes());

export default router;


