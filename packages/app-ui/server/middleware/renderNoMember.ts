import { Context } from 'koa';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import config from '../config';
import NoMember from '../views/no-member';


const renderNoMember = async function (ctx: Context): Promise<void> {
  const index = (
    <NoMember baseUrl= { config.client.basePath } />
  );

ctx.body = '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(index);
};

export default renderNoMember;