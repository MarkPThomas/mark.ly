
import fs from 'fs';
import path from 'path';

import { Context } from 'koa';
import Router from 'koa-router';

const router = new Router();

const filePath = path.resolve(__dirname, '../../build', 'index.html');
const indexHtml = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });


export const homePreInit = async (ctx: Context): Promise<void> => {
  let data = indexHtml;

  // TODO: Sample usage
  // data = data.replace(/"%PRISM_DATA%"/g, JSON.stringify(ctx.state.prismObject));
  // data = data.replace(/%REACT_APP_ADOBE_LAUNCH_SCRIPT%/g, `<script src="${config.segment.dtmUrl}" async></script>`);

  ctx.body = data;
};

router.get('/', homePreInit);

export default router;