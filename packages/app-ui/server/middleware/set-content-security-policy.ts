import { Context, Next } from 'koa';

// Note: script-src is incomplete. If this middleware doesn't work correctly, either finish that line or skip this.
export default async (ctx: Context, next: Next): Promise<void> => {
  ctx.set(
    'Content-Security-Policy',
    "default-src * data: blob: 'self';" +
    "script-src  'unsafe-inline' 'unsafe-eval' blob: data: 'self'; " +
    "object-src 'self';" +
    "style-src data: blob: 'unsafe-inline' *;"
  );
  await next();
};