import { exec } from 'child_process';

import { Connection } from 'common/database/connection';
import stoppable from 'stoppable';

import app from './app';
import config from './config';
import { createDBConnection } from './db-connection';
import logger from './logger';

(async () => {
  let dbConnection;

  try {
    dbConnection = await createDBConnection();
  } catch (err) {
    logger.fatal(
      {
        message: 'DB connection failed.',
        layer: 'START_UP',
        errorMessage: err.toString()
      },
      err
    );

    process.exit(1);
  }

  const server = stoppable(
    app.listen(config.api.port, () => {
      logger.info({
        message: `Server running on port ${config.api.port}`,
        layer: 'START_UP'
      });
    })
  );

  // TODO: TOLEARN
  if (!process.env.KUBE) {
    exec('python -c "import systemd.daemon, time; systemd.daemon.notify(\'READY=1\'); time.sleep(15)"');
  }

  gracefullShutdown(server, dbConnection);
})();


function gracefullShutdown(server: stoppable.StoppableServer, dbConnection: Connection) {
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  function shutdown() {
    server.stop(() => {
      dbConnection
        .destroy()
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