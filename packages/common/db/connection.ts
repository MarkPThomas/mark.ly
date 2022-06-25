import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
export * from 'typeorm';

import * as entities from './models';

export enum DbType {
  mySql = 'mysql',
  postgres = 'postgres',
  cockroachdb = 'cockroachdb',
  sap = 'sap',
  spanner = 'spanner',
  mariadb = 'mariadb',
  sqlite =  'sqlite',
  cordova = 'cordova',
  react_native = 'react-native',
  nativescript = 'nativescript',
  sqljs = 'sqljs',
  oracle = 'oracle',
  mssql = 'mssql',
  mongodb = 'mongodb',
  aurora_mysql = 'aurora-mysql',
  aurora_postgres = 'aurora-postgres',
  expo = 'expo',
  better_sqlite3 = 'better-sqlite3',
  capacitor = 'capacitor'
}

export interface ConnectionOptions {
  type?: DbType;
  host: string;
  port: number;
  user: string;
  password: string;
  synchronize?: boolean;
  database: string;
  logging?: boolean;
};

export default (config: ConnectionOptions) =>
  new DataSource({
    type: config.type || DbType.postgres,
    host: config.host,
    port: config.port,
    username: config.user,
    password: config.password,
    database: config.database,
    entities: Object.values(entities),
    logging: config.logging || false,
    synchronize: Boolean(config.synchronize)
  } as DataSourceOptions);