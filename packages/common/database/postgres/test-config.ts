import { ConnectionOptions, DbType } from './connection';

export default {
  host: process.env.POSTRES_HOST || DbType.postgres,
  port: 5432,
  user: 'guest',
  password: 'password',
  database: process.env.POSTGRES_DATABASE || 'app-api',
  logging: false
} as ConnectionOptions;