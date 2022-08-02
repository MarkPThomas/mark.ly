import { Router } from 'express';

import root from './root';
import noMatch from './no-match';
import routes from '../routes';

const router = Router();

router
  .use(routes)
  // .use(noMatch)
  .use(root);

export default router;