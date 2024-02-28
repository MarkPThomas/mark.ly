import os from 'os';
import Logger from 'bunyan';
import * as bunyan from 'bunyan';
import { Stream, LogLevelString } from 'bunyan';
import accessLog from 'access-log';

export interface LogConfig {
  logLevel: string;
  logName: string;
  logDebug?: boolean;
  useMultipleFiles?: boolean;
}

export const createLogger = (name: string): Logger => {
  const stream: Stream = { stream: process.stdout };

  return bunyan.createLogger({
    name: name,
    serializers: { err: bunyan.stdSerializers.err },
    streams: [stream]
  });
};

export type LoggingLayer =
  | 'API'
  | 'MIDDLEWARE'
  | 'SERVICE'
  | 'REPOSITORY'
  | 'LISTENER'
  | 'SUBSCRIBER'
  | 'PUBLISHER'
  | 'TEMPORARY'
  | 'BACKGROUND_JOB'
  | 'ACCESS_LOG'
  | 'START_UP'
  | 'SHUT_DOWN'
  | 'MIGRATION';

export interface LogMessage {
  message: string;
  layer: LoggingLayer;
  payload?: any;
  errorMessage?: string;
}

type LogFn = (msg: string | LogMessage, error?: any) => void;

export type Loggers = {
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  debug: LogFn;
  fatal: LogFn;
  accessLog: (ctx: any, next: any) => void;
};


const getLogFn = (
  logger: Logger,
  level: LogLevelString,
  shouldLogDebug: boolean,
  debugLogger: Logger,
  packageName: string
): LogFn => {
  return (msg, error = '') => {
    const baseLog = {
      logLevel: level,
      layer: (msg && (msg as LogMessage).layer) || 'NO_LAYER_DEFINED',
      packageName
    };
    const message = msg && typeof msg === 'object'
      ? { ...msg }
      : { message: msg };
    const log = { ...baseLog, ...message };

    logger[level](log, error);
    if (shouldLogDebug && level !== 'debug') {
      debugLogger.debug(log, error);
    }
  };
};

const getAccessLogFn = (
  shouldLogDebug: boolean,
  debugLogFn: LogFn,
  packageName: string
) => {

  const accessLogger = createLogger('api-access');

  return async (ctx: any, next: any) => {
    await next();

    const user = ctx.handle ? ctx.handle : '-';
    const format = `:host - ${user} [:clfDate] ":method :url :protocol/:httpVersion" :statusCode :contentLength`;

    accessLog(ctx.req, ctx.res, format, (logMessage: string) => {
      accessLogger.info({
        message: logMessage,
        layer: 'ACCESS_LOG',
        logLevel: 'info',
        packageName,
        payload: {
          request: ctx.request
        }
      });

      if (shouldLogDebug) {
        debugLogFn(`${logMessage}${os.EOL}`);
      }
    })
  };
};

export default function create(config: LogConfig, packageName = 'NO_PACKAGE_DEFINED') {
  if (!config.logLevel) throw new Error('The logLevel is required for the logger config.');
  if (!config.logName) throw new Error('The logName is required for the logger config.');

  const shouldLogDebug = config.logDebug || false;
  const logName = config.logName;

  const debugLogger = createLogger(logName);
  const debugLogFn = getLogFn(debugLogger, 'debug', shouldLogDebug, debugLogger, packageName);
  const accessLogFn = getAccessLogFn(shouldLogDebug, debugLogFn, packageName);

  const infoLogFn = getLogFn(createLogger(logName), 'info', shouldLogDebug, debugLogger, packageName);
  const warnLogFn = getLogFn(createLogger(logName), 'warn', shouldLogDebug, debugLogger, packageName);
  const errorLogFn = getLogFn(createLogger(logName), 'error', shouldLogDebug, debugLogger, packageName);
  const fatalLogFn = getLogFn(createLogger(logName), 'fatal', shouldLogDebug, debugLogger, packageName);

  const loggers: Loggers = {
    debug: debugLogFn,
    info: infoLogFn,
    warn: warnLogFn,
    error: errorLogFn,
    fatal: fatalLogFn,
    accessLog: accessLogFn,
  }

  return loggers;
}