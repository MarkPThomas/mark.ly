import * as dotenv from 'dotenv';
import * as path from 'path';

import commonConfig from 'common/config';
import * as entities from 'common/db/models';

dotenv.config({ path: path.normalize(`${__dirname}/.env`) });
const e = process.env;

export default {
  appName: 'weather.ly',
  env: e.NODE_ENV,
  port: e.PORT,
  host: e.HOST,
  db: {
    host: e.POSTGRES_HOST,
    port: Number(e.POSTGRES_PORT),
    database: e.POSTGRES_DATABASE,
    user: e.POSTGRES_USERNAME,
    password: e.POSTGRES_PASSWORD,
    dialect: 'postgrtes',
    ssl: null
  },
  bunyan: {
    logDebug: e.LOG_DEBUG ? JSON.parse(e.LOG_DEBUG.toLocaleLowerCase()) : 'false',
    logLevel: e.LOG_LEVEL,
    logName: 'weather.ly',
    unifiedWebLogFile: e.UNIFIED_WEB_LOG
  }
};