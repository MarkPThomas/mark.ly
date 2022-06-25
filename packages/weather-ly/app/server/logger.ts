import createLogger, { LogConfig } from 'common/logger';
import config from './config';

export default createLogger(config.bunyan as LogConfig, 'WEATHER_LY');