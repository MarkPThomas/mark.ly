import { Router } from 'express';

// import { tileApiKeyValidate } from '../middleware/tileApiKeyValidate';
import * as tileApiController from './tileApiKey';

const router = Router();

// TODO: Fix/finish validation middleware. See tileApiKeyValidate
router.get('/tileApiKey', tileApiController.getApiKey);
// router.get('/tileApiKey', tileApiKeyValidate, tileApiController.getApiKey);

export default router;