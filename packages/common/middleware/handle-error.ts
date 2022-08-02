import { Loggers } from '../logger';

export default ({ logger }: { logger: Loggers }) =>
  async (next: () => void) => {
    try {
      await next();
    } catch (error) {
      logger.error(
        {
          message: 'handle-error middleware.',
          layer: 'MIDDLEWARE',
          errorMessage: JSON.stringify(error)
        },
        error
      );
    }
  };