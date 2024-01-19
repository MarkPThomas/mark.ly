import { ConnectionOptions, DbType } from './connection';

export default {
  host: process.env.POSTRES_HOST || DbType.postgres,
  port: 5432,
  user: 'foo',
  password: 'bar',
  database: process.env.POSTGRES_DATABASE || 'fooDB',
  logging: false
} as ConnectionOptions;