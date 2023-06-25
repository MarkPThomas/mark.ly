import Router from 'koa-router';

import { homePreInit } from './home';

const router = new Router();
router.get('(.*)', homePreInit);

export default router;