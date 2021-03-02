import * as Sentry from '@sentry/node';
import { json, urlencoded } from 'body-parser';
import chalk from 'chalk';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createServer, Server } from 'http';
import morgan from 'morgan';
import passport from 'passport';
import { Logger } from './commons/logger/logger';
import { handleError } from './commons/utils/handle-error';
import { AppDb } from './db/db';
import { migrate } from './db/migrate/migrate';
import { setupDbIndexes } from './db/setup-db-indexes';
import { env } from './env/env';
import { setupPrometheus } from './prometheus/setup-prometheus';
import routes from './routes';
import { io } from './socket/io';
import { configureCaddy } from './caddy/configuration';
import { authorizeReq } from './auth/handlers/authorize-req';
import { authorizeApiReq } from './auth/handlers/authorize-api-req';
import './socket/socket-rooms';
import './auth/passport';

const logger = new Logger('meli.api:server');

logger.info(`Meli Server ${
  chalk.blue(BUILD_INFO.version)
} - ${
  chalk.blue(BUILD_INFO.buildDate)
} - ${
  chalk.blue(BUILD_INFO.commitHash)
}`);

logger.debug(`Sentry release=${chalk.blue(SENTRY_RELEASE)}, dsn=${chalk.blue(SENTRY_DSN)}`);
if (env.MELI_SENTRY_ENABLED && SENTRY_DSN && SENTRY_RELEASE) {
  logger.info(`Sentry is ${chalk.green('enabled')}`);
  Sentry.init({
    dsn: SENTRY_DSN,
    release: SENTRY_RELEASE,
  });
} else {
  logger.info(`Sentry is ${chalk.red('disabled')}`);
}

export interface MeliServer {
  app: Express;
  httpServer: Server;
  stop: () => void;
}

export async function server(): Promise<MeliServer> {
  await AppDb.init();
  await migrate(AppDb.client, AppDb.db);
  setupDbIndexes().catch(err => logger.error('Could not setup indexes indexes', err));
  await configureCaddy();

  const app = express();

  // middlewares
  app.use(Sentry.Handlers.requestHandler()); // must be first
  app.use(rateLimit({
    windowMs: env.MELI_RATE_LIMIT_WINDOW,
    max: env.MELI_RATE_LIMIT_MAX_PER_WINDOW,
  }));
  app.use(morgan('tiny'));
  app.use(urlencoded({
    extended: true,
  }));
  app.use(json());
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());
  app.use(cors({
    origin: env.MELI_UI_URL,
    credentials: true,
  }));

  // auth
  app.use(passport.initialize());
  app.use(authorizeReq);
  app.use(authorizeApiReq);

  // routes
  app.use(routes);

  // error handlers
  app.use(Sentry.Handlers.errorHandler());
  app.use(handleError);

  const httpServer = createServer(app);

  httpServer.listen(env.MELI_PORT, () => {
    logger.info(`Listening on port ${chalk.bold.green(env.MELI_PORT)}`);
  });

  if (env.MELI_PROMETHEUS_HOST && env.MELI_PROMETHEUS_PORT) {
    await setupPrometheus(app, env.MELI_PROMETHEUS_HOST, env.MELI_PROMETHEUS_PORT);
  }

  io.listen(httpServer);

  return {
    app,
    httpServer,
    stop: () => {
      logger.info('Stopping HTTP server');
      httpServer.close();
    },
  };
}
