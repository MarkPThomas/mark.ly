import createLogger from 'common/logger';
import config from './config';

export default createLogger(config.bunyan, 'APP_UI');