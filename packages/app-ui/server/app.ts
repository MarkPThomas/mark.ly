import handleError from 'common/middleware/handle-error';
// import validateRequestType from 'common/middleware/validate-request-type';
import Koa from 'koa';
import bodyParser from 'koa-body';

import graphqlProxyOptions from './graphql-proxy-options';
import logger from './logger';
// import graphqlProxy from './middleware/graphql-proxy';
import serveStaticAssets from './middleware/serve-static-assets';
import setContentSecurityPolicy from './middleware/set-content-security-policy';
import router from './router';
import system from './system';
import { applyAxiosErrorHandler } from 'common/utils/axios';

applyAxiosErrorHandler();

const app = new Koa();

app
  .use(handleError({ logger }))
  .use(system.routes())
  // .use(graphqlProxy(graphqlProxyOptions))
  .use(bodyParser())
  .use(serveStaticAssets())
  // .use(validateRequestType)
  .use(setContentSecurityPolicy)
  .use(router.routes());

app.on('error', (err) =>
  logger.error(
    {
      message: 'Koa server error event.',
      layer: 'API',
      errorMessage: err.toString()
    },
    err
  )
);

export default app;