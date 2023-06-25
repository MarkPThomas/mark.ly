import createLogger from 'common/logger';
import config from './config';

export default createLogger(config.logger, 'APP_API');