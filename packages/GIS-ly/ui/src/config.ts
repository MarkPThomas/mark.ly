import toSnakeCase from '../../../common/utils/toSnakeCase';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as config from './config.json';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.normalize(`${__dirname}/../../ui/.env`) });
}

const importedConfig: IConfig = config as IConfig;
console.log('importedConfig:', importedConfig);

const e = process.env;
console.log('Config Env, e:', e);

importedConfig.baseLayers.forEach((baseLayer) => {
  const nameProp = toSnakeCase(baseLayer.name).toUpperCase() + '_API_KEY';
  const api = e[nameProp];
  if (api) {
    baseLayer.url += api;
  }
});

// TODO: Read units to convert to normalized/default units
export default {
  apiKeys: {
    thunderforest: e.THUNDERFOREST_API_KEY,
  },
  baseLayers: importedConfig.baseLayers,
  trackCriteria: importedConfig.trackCriteria
};

export interface IConfig {
  baseLayers: IBaseLayer[]
  trackCriteria: ITrackCriteria
}

export interface IBaseLayer {
  name: string
  attributions: IAttribution[]
  url: string
}

export interface IAttribution {
  label: string
  url?: string
}

export interface ITrackCriteria {
  units?: IUnits
  activities: IActivity[]
  cruft: {
    units?: IUnits
    pointSeparationLimit: number
  }
  noiseCloud: {
    units?: IUnits
    speedMin: number
  }
  misc: {
    units?: IUnits
    gpsTimeInterval: number
  }
}

export interface IActivity {
  activity: string
  units?: IUnits
  speed: {
    units?: IUnits
    min: number,
    max: number
  }
  rotation?: {
    units?: IUnits
    angularVelocityMax: number
  }
  elevation?: {
    units?: IUnits
    maxAscentRate: number,
    maxDescentRate: number
  }
  slope?: {
    units?: IUnits
    maxPercent: number
  }
}

export interface IUnits {
  length?: 'mile' | 'foot' | 'kilometer' | 'meter'
  time?: 'second' | 'minute' | 'hour'
  angle?: 'radian' | 'degree' | 'percent'
}