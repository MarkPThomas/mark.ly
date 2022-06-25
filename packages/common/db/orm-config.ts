import { DataSourceOptions } from 'typeorm';
import * as entities from './models/public';
import { DbType } from './connection';

const env = process.env;

export const config: DataSourceOptions = {
  type: DbType.postgres,
  schema: env.POSTGRES_SCHEMA,
  host: env.POSTGRES_HOST,
  port: Number(env.POSTGRES_PORT),
  username: env.POSTGRES_USERNAME,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  entities: Object.values(entities),
  migrations: ['db/migration/*.ts'],
  migrationsTableName: 'typeorm_migration',
  ssl: false
};