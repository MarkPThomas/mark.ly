import config from './config';

export default {
  target: config.graphqlServer.host,
  rewrite: (): string => config.graphqlServer.path,
  secure: false,
  changeOrigin: true
};