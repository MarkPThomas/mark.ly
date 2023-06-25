import * as fs from 'fs';
import * as path from 'path';

import * as entities from 'common/database/models';
import * as dotenv from 'dotenv';


dotenv.config({ path: path.normalize(`${__dirname}/.env`) });
const e = process.env;
const useSSL = e.POSTGRES_SSL_KEY && e.POSTGRES_SSL_KEY.toLowerCase() !== 'false';
export default {
  appName: 'app-ui-web',
  env: e.NODE_ENV,
  port: e.PORT,
  host: e.HOST,
  protocol: e.PROTOCOL,
  db: {
    host: e.POSTGRES_HOST,
    port: Number(e.POSTGRES_PORT),
    database: e.POSTGRES_DATABASE,
    user: e.POSTGRES_USERNAME,
    password: e.POSTGRES_PASSWORD,
    dialect: 'postgres',
    ssl: useSSL
      ? {
        rejectUnauthorized: false,
        ca: fs.readFileSync(e.POSTGRES_SSL_KEY).toString()
      }
      : null
  },
  dbCluster: {
    type: 'postgres' as const,
    entities: Object.values(entities),
    replication: {
      master: {
        host: e.POSTGRES_HOST,
        port: Number(e.POSTGRES_PORT),
        database: e.POSTGRES_DATABASE,
        username: e.POSTGRES_USERNAME,
        password: e.POSTGRES_PASSWORD,
        ssl: useSSL
          ? {
            rejectUnauthorized: false,
            ca: fs.readFileSync(e.POSTGRES_SSL_KEY).toString()
          }
          : null
      },
      slaves: [
        {
          host: e.POSTGRES_SLAVE_HOST,
          port: Number(e.POSTGRES_PORT),
          database: e.POSTGRES_DATABASE,
          username: e.POSTGRES_USERNAME,
          password: e.POSTGRES_PASSWORD,
          ssl: useSSL
            ? {
              rejectUnauthorized: false,
              ca: fs.readFileSync(e.POSTGRES_SSL_KEY).toString()
            }
            : null
        }
      ]
    }
  },
  test: {
    userWithClaims: {
      username: e.TEST_USER_WITH_CLAIMS,
      password: e.TEST_USER_WITH_CLAIMS_PASSWORD
    },
    userWithoutClaims: {
      username: e.TEST_USER_WITHOUT_CLAIMS,
      password: e.TEST_USER_WITHOUT_CLAIMS_PASSWORD
    }
  },
  identity: {
    apiUrl: e.IDENTITY_API_URL,
    apiKey: e.IDENTITY_API_KEY,
    sessionCookieName: e.SESSION_COOKIE_NAME
  },
  projects: {
    apiUrl: e.PROJECT_URL,
    apiKey: e.PROJECT_TOKEN
  },
  memberClaim: 'member',
  developersClaim: 'developer',
  allowedClaims: ['author', 'developer'],
  client: {
    assetsPath: '/app-ui',
    basePath: '/app-ui'
  },
  graphqlServer: {
    host: e.GRAPHQL_HOST,
    path: e.GRAPHQL_PATH
  },
  graphql: {
    path: '/content/graphql'
  },
  bunyan: {
    logDebug: e.LOG_DEBUG ? JSON.parse(e.LOG_DEBUG.toLowerCase()) : 'false',
    logLevel: e.LOG_LEVEL,
    logName: 'app-ui',
    unifiedWebLogFile: e.UNIFIED_WEB_LOG
  },
  featureExpirationTime: 3600e3,
};