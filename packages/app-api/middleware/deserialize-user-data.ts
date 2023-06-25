import { Context, Next } from 'koa';

export interface IUserData {
  userId?: string;
  userHandle: string;
  claims: string[];
  features: string[];
}

export default async (ctx: Context, next: Next): Promise<void> => {
  try {
    if (ctx.request.get('x-user')) {
      const xUser = JSON.parse(ctx.request.get('x-user')) as IUserData;
      ctx.state = { ...ctx.state, ...xUser };
    }
  } catch (e) {
    throw new Error('Cant deserialize user data');
  }

  await next();
};