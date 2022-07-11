import config from './config';
import connectDb, { ConnectionOptions } from 'common/db/connection';

export const createDBConnection = () => {
  return connectDb(config.db as ConnectionOptions);
}