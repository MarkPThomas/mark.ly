import { Router } from 'express';

import * as forecastController from './forecast';

const router = Router();

router.get('/forecast', forecastController.getForecast);
router.get('/forecasts', forecastController.getForecasts);

router.get('/grids', forecastController.getAllGrids);
router.get('/pointGroups', forecastController.getAllPointGroups);
router.get('/points', forecastController.getAllPoints);

export default router;