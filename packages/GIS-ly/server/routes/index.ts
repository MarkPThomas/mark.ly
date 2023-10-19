import { Router } from 'express';

import { tileApiKeyValidate } from '../middleware/tileApiKeyValidate';
import * as tileApiController from './tileApiKey';

const router = Router();

router.get('/tileApiKey', tileApiKeyValidate, tileApiController.getApiKey);

export default router;