import IdentityApi from 'common/api-wrappers/identity';
import UserClaimCache from 'common/caches/user-claims-cache';
import { HttpForbidden, HttpUnauthorized } from 'common/errors/http';
import addCsrfSalt from 'common/middleware/add-csrf-salt';
import addCsrfToken from 'common/middleware/add-csrf-token';
import authenticateSession from 'common/middleware/authenticate-session';
import getUserClaims from 'common/middleware/get-user-claims';
import validateEmployeeClaimsForRequest from 'common/middleware/validate-by-claims';
import { Middleware } from 'koa';
import compose from 'koa-compose';
import mount from 'koa-mount';
import proxy from 'koa-proxies';

import config from '../config';

import authAuthor from './auth-member';
import serializeUser from './serialize-user';

const identityApi = new IdentityApi({ apiUrl: config.identity.apiUrl, apiKey: config.identity.apiKey });

interface ProxyOptions {
  target: string;
  rewrite: () => string;
  secure: boolean;
  changeOrigin: boolean;
}

export default (proxyOptions: ProxyOptions): Middleware =>
  mount(
    `${config.client.basePath}/graphql`,
    compose([
      authenticateSession(identityApi, config.identity.sessionCookieName, () => {
        throw new HttpUnauthorized();
      }),
      getUserClaims(new UserClaimCache(identityApi)),
      validateEmployeeClaimsForRequest(config.allowedClaims, () => {
        throw new HttpForbidden();
      }),
      authAuthor,
      serializeUser,
      addCsrfSalt,
      addCsrfToken,
      proxy('/', proxyOptions)
    ])
  );