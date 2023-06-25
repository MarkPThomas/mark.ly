import { Context } from 'koa';

import accessTokenRepo from '../database/repositories-orm/access-token';
import { StatusCode } from '../enums/status-code.enum';
import guid from '../util-ts/guid';

function generateToken(service: string, client: string) {
  return {
    issuedBy: service,
    client,
    token: guid(),
    createdDate: new Date()
  };
}

export const createAuthMiddleware = ({ service }: { service: string }) =>
  async function (ctx: Context, next: () => Promise<void>) {
    const token = ctx.request.get('Authorization');

    const accessToken = await accessTokenRepo().findOne({ where: { token, issuedBy: service } });

    if (!accessToken) {
      return ctx.throw(StatusCode.Forbidden, 'Invalid access token: ' + token);
    }

    ctx.handle = accessToken.client;

    await next();
  };

export const createTokenController = ({ service }: { service: string }) =>
  async function (ctx: any) {
    const { client } = ctx.request.body;

    if (!client) {
      return ctx.throw(StatusCode.BadRequest, 'client required');
    }

    const clientString = client.toLowerCase();
    const accessToken = await accessTokenRepo().findOne({ where: { client: clientString, issuedBy: service } });

    if (accessToken) {
      return (ctx.body = { token: accessToken.token });
    }

    const createdAccessToken = await accessTokenRepo().save(generateToken(service, clientString));

    ctx.body = { token: createdAccessToken.token };
  };