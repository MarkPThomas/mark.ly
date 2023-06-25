import path from 'path';

import IdentityApi from 'common/api-wrappers/identity';
import UserClaimsCache from 'common/caches/user-claims-cache';
import getUserClaims from 'common/middleware/get-user-claims';
import { Middleware } from 'koa';
import compose from 'koa-compose';
import mount from 'koa-mount';
import serve from 'koa-static';

import config from '../config';

const assetsDir = path.join(__dirname, '../../build');
const identityApi = new IdentityApi({ apiUrl: config.identity.apiUrl, apiKey: config.identity.apiKey });

export default (): Middleware =>
  mount(
    config.client.assetsPath,
    compose([
      getUserClaims(new UserClaimsCache(identityApi)),
      serve(assetsDir, {
        index: false
      })
    ])
  );