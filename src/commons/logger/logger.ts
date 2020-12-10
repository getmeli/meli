import * as winston from 'winston';
import debug from 'debug';
import { buildWinstonLogger } from './build-winston-logger';

export class Logger {
  private static winstonLogger: winston.Logger = buildWinstonLogger();

  private debugger;

  constructor(private readonly context?: string) {
    // TODO see if possible to ask debug to JSON.stringify(val, null, 2) every object
    this.debugger = debug(context);
  }

  info(message: string, ...args: any[]): void {
    Logger.winstonLogger.info(message, {
      context: this.context,
      meta: {
        args,
      },
    });
  }

  warn(message: string, ...args: any[]): void {
    Logger.winstonLogger.warn(message, {
      context: this.context,
      meta: {
        args,
      },
    });
  }

  error(error: any, ...args: any[]): void {
    Logger.winstonLogger.error(error, {
      context: this.context,
      meta: {
        args: [
          ...args,
          ...(error.stack ? [error.stack] : []),
          ...args
            .filter(arg => !!arg.stack)
            .map(arg => arg.stack),
        ],
      },
    });
  }

  debug(...args: any[]): void {
    this.debugger(...args);
  }
}
