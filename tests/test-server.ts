import { json, urlencoded } from 'body-parser';
import chalk from 'chalk';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express  from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import morgan from 'morgan';
import passport from 'passport';
import { Logger } from '../src/commons/logger/logger';
import { handleError } from '../src/commons/utils/handle-error';
import { STRIPE_SIGNATURE_HEADER } from '../src/constants';
import { env } from '../src/env/env';
import routes from '../src/routes';
import { MeliServer } from '../src/server';
import { io } from '../src/socket/io';
import { authorizeReq } from '../src/auth/handlers/authorize-req';
import { authorizeApiReq } from '../src/auth/handlers/authorize-api-req';
import '../src/socket/socket-rooms';
import '../src/auth/passport';

const logger = new Logger('meli.api:test-server');

export async function testServer(): Promise<MeliServer> {
  const app = express();

  // middlewares
  app.use(morgan('tiny'));
  app.use(urlencoded({
    extended: true,
  }));
  app.use(json({
    verify: (req: any, res, buf) => {
      // store raw body for signature verification
      if (
        Buffer.isBuffer(buf)
        && (
          // important to store rawBody for Stripe signature verification
          req.header(STRIPE_SIGNATURE_HEADER)
        )
      ) {
        req.rawBody = buf;
      }
      return true;
    },
  }));
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
  app.use(handleError);

  const httpServer = createServer(app);

  httpServer.listen(env.MELI_PORT, () => {
    logger.info(`Listening on port ${chalk.bold.green(env.MELI_PORT)}`);
  });

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
