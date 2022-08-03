import { IForecastResponse } from '../../api/model';

import valleyOfGodsData from './forecast.lat37.29133062148915.long-109.83611583709714.json';
import indianCreekData from './forecast.lat38.02520880653333.long-109.53941773096282.json';
import canyonlandsNpData from './forecast.lat38.31364599165795.long-109.85667228698729.json';
import archesNpData from './forecast.lat38.70391142341995.long-109.56324129476073.json';
import castleValleyData from './forecast.lat38.651399423709364.long-109.36782360076903.json';
import fisherTowersData from './forecast.lat38.721344951529915.long-109.2970132827759.json';
import coNatlMonData from './forecast.lat39.032014392349595.long-108.64900188404135.json';

export const valleyOfGods = valleyOfGodsData as IForecastResponse;
export const indianCreek = indianCreekData as IForecastResponse;
export const canyonlandsNp = canyonlandsNpData as IForecastResponse;
export const archesNp = archesNpData as IForecastResponse;
export const castleValley = castleValleyData as IForecastResponse;
export const fisherTowers = fisherTowersData as IForecastResponse;
export const coNatlMon = coNatlMonData as IForecastResponse;

export const forecasts = [
  valleyOfGods,
  indianCreek,
  canyonlandsNp,
  archesNp,
  castleValley,
  fisherTowers,
  coNatlMon
] as IForecastResponse[];