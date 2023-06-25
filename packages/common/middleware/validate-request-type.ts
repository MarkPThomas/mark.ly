import { Context } from 'koa';

import { HttpNotAcceptable } from '../errors/http';

export default async (ctx: Context, next: any) => {
  if (ctx.request.type && !['application/json', 'multipart/form-data'].includes(ctx.request.type)) {
    throw new HttpNotAcceptable();
  }

  await next();
};