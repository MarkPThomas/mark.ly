import { Router } from 'express';

import root from './root';
import routes from '../routes';

const router = Router();

router
  .use(routes)
  .use(root);

export default router;