import uuid from 'common/utils/guid';
import { Context, Next } from 'koa';

import logger from '../logger';

export default async (ctx: Context, next: Next): Promise<void> => {
  const requestId = uuid();
  ctx.state.requestId = requestId;
  const start = Date.now();
  await next();
  const latency = Date.now() - start;
  logger.info({
    layer: 'MIDDLEWARE',
    message: `Latency of ${latency} for request of requestId ${requestId}`
  });
};