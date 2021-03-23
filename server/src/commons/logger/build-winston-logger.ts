import chalk from 'chalk';
import { hostname } from 'os';
import * as winston from 'winston';

// https://github.com/winstonjs/winston#logging-levels
type LogLevel =
  | 'error'
  | 'warning'
  | 'info'
  | 'debug'
  ;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: string;
  meta: {
    args: any[];
  };
}

const chalkColorMap = new Map<LogLevel, any>([
  ['info', chalk.bold.green],
  ['debug', chalk.bold.gray],
  ['warning', chalk.bold.yellow],
  ['error', chalk.bold.red],
]);

const processId = process.pid;
const host = hostname();

function winstonFormat() {
  return winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    // winston.format.align(),
    winston.format.printf((info: LogEntry) => {
      const {
        timestamp, level, message, context, meta: { args },
      } = info;
      const chalkFn = chalkColorMap.get(level);
      const contextPart = context ? ` ${chalk.cyan(context)}` : undefined;
      const levelPart = chalkFn ? chalkFn(level) : level;
      const argsPart = args ? ` ${args.join(' ')}` : '';
      return `${host} ${processId} ${timestamp} ${levelPart} ${contextPart} ${message}${argsPart}`;
    }),
  );
}

export function buildWinstonLogger(level: LogLevel = 'info'): winston.Logger {
  return winston.createLogger({
    level,
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        format: winstonFormat(),
        level,
      }),
    ],
  });
}
