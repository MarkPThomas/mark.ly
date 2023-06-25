import { Context } from 'koa';
import { Loggers } from '../logger';
import { StatusCode } from '../enums/status-code.enum';

export default ({ logger }: { logger: Loggers }) =>
  async (ctx: Context, next: () => void) => {
    try {
      await next();
    } catch (error: any) {
      const requestId = ctx?.state?.requestId;
      logger.error(
        {
          message: 'Koa handle-error middleware.',
          layer: 'MIDDLEWARE',
          payload: {
            requestId,
            request: JSON.stringify(ctx.request)
          },
          errorMessage: JSON.stringify(error)
        },
        error
      );
      ctx.body = error.message || 'Internal Server Error';
      ctx.status = error.status || StatusCode.InternalServerError;
    }
  };