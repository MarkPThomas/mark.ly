import { Context } from 'koa';
import Router from 'koa-router';

import config from '../../config';

const router = new Router({ prefix: `${config.api.baseUrl}/system` });

router.get('/health-check', (ctx: Context) => {
  ctx.body = 'Service Works';
  ctx.status = 200;
});

export default router;