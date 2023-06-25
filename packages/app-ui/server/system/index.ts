import { Context } from 'koa';
import Router from 'koa-router';

import config from '../config';

const router = new Router({ prefix: config.client.basePath });

router.get('/system/health-check', (ctx: Context) => {
  ctx.body = 'Service Works';
  ctx.status = 200;
});

router.get('/system/health-check/k8s', (ctx: Context) => {
  ctx.body = 'Service Works';
  ctx.status = 200;
});

export default router;