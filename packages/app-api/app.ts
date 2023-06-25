import handleError from 'common/middleware/handle-error';
// import validateCsrfToken from 'common/middleware/validate-csrf-token';
// import validateRequestType from 'common/middleware/validate-request-type';

import { graphqlUploadKoa } from 'graphql-upload/graphqlUploadKoa.mjs';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';

import { mountAppFrontendUrlGQL } from './apollo-gql/app-frontend-url';
import config from './config';
import logger from './logger';
import deserializeUserData from './middleware/deserialize-user-data';
import requestLogger from './middleware/request-logger';
import system from './router/system';

// DEPLOY: use this comment to trigger deploy.
const app = new Koa();

app
  .use(handleError({ logger }))
  .use(helmet())
  .use(system.routes())
  .use(bodyParser())
  .use(graphqlUploadKoa({ maxFileSize: 10000000, maxFiles: 10 }))
  // .use(validateRequestType)
  .use(deserializeUserData)
  // .use(validateCsrfToken)
  .use(requestLogger)

mountAppFrontendUrlGQL(app, `${config.api.baseUrl}/app-api/graphql`);

export default app;