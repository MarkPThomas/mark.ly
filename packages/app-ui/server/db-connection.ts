import connectDb, { Connection, createConnection } from 'common/database/connection';

import config from './config';

export const createDBConnection = (): Promise<Connection> => {
  if (config.env === 'production') {
    return createConnection(config.dbCluster);
  } else {
    return connectDb(config.db);
  }
};


