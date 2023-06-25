import { Connection } from 'common/database/connection';
import stoppable from 'stoppable';

import app from './app';
import config from './config';
import { createDBConnection } from './db-connection';
import logger from './logger';

const { exec } = require('child_process');

process.on('unhandledRejection', (error: Error) => {
  logger.fatal(
    {
      message: 'Api unhandledRejection error',
      layer: 'API',
      errorMessage: error.toString()
    },
    error
  );
});

process.on('uncaughtException', (error) => {
  logger.fatal(
    {
      message: 'Api uncaughtException error',
      layer: 'API',
      errorMessage: error.toString()
    },
    error
  );
});

(async () => {
  let dbConnection;

  try {
    dbConnection = await createDBConnection();
  } catch (err) {
    logger.fatal(
      {
        message: 'Failed to create DB connection.',
        layer: 'START_UP',
        errorMessage: err.toString()
      },
      err
    );

    process.exit(1);
  }

  const server = stoppable(
    app.listen(config.port, () => {
      logger.info({
        message: `Server running on port ${config.port}`,
        layer: 'START_UP'
      });
      if (!process.env.KUBE) {
        exec('python -c "import systemd.daemon, time; systemd.daemon.notify(\'READY=1\'); time.sleep(15)"');
      }
    })
  );


  gracefullShutdown(server, dbConnection);
})();

function gracefullShutdown(server: stoppable.StoppableServer, dbConnection: Connection) {
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  function shutdown() {
    server.stop(() => {
      dbConnection
        .close()
        .then(() => {
          logger.info({
            message: `Server shutdown gracefully`,
            layer: 'SHUT_DOWN'
          });

          process.exit(0);
        })
        .catch((err) => {
          logger.fatal(
            {
              message: `Error while closing database connection`,
              layer: 'SHUT_DOWN'
            },
            err
          );

          process.exit(1);
        });
    });
  }
}