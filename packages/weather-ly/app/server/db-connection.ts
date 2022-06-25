import config from './config';
import connectDb, { ConnectionOptions } from 'common/db/connection';

export const createDBConnection = () => {
  if (config.env === 'production') {
    return connectDb(config.db /* config.dbCluster */ as ConnectionOptions);
  } else {
    return connectDb(config.db as ConnectionOptions);
  }
}