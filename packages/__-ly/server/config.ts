import * as dotenv from 'dotenv';
import * as path from 'path';
import config from '../project.config';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.normalize(`${__dirname}/../../server/.env`) });
}

const e = process.env;

export default {
  app: config,
  env: e.NODE_ENV,
  port: Number(e.PORT),
  host: e.HOST,
  client: {
    protocol: e.CLIENT_PROTOCOL,
    host: e.CLIENT_HOST,
    port: Number(e.CLIENT_PORT),
  },
  db: {
    host: e.POSTGRES_HOST,
    port: Number(e.POSTGRES_PORT),
    database: e.POSTGRES_DATABASE,
    user: e.POSTGRES_USERNAME,
    password: e.POSTGRES_PASSWORD,
    dialect: e.DB_DIALECT,
    ssl: null
  },
  bunyan: {
    logDebug: e.LOG_DEBUG ? JSON.parse(e.LOG_DEBUG.toLocaleLowerCase()) : 'false',
    logLevel: e.LOG_LEVEL,
    logName: e.APP_NAME,
    unifiedWebLogFile: e.UNIFIED_WEB_LOG
  }
};