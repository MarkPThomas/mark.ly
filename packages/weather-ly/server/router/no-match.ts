import { Router } from 'express';

const router = Router();

const preInit = async () => {
  // TODO: Working out pattern. Placeholder :-(
};

router.get('(.*)', preInit);

export default router;