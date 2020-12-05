import { createMiddleware } from '@promster/express';
import client from 'prom-client';
import { Logger } from '../commons/logger/logger';
import { createServer } from 'http';
import chalk from 'chalk';
import { env } from '../env';
import { Application } from 'express';
import { up } from './metrics/up';
import { userCount } from './metrics/user-count';

const logger = new Logger('meli.api:prometheus');

function registerCustomMetrics() {
  const updateMetrics = () => {
    Promise
      .all([
        up(),
        userCount(),
      ])
      .catch(err => logger.error(err));
  };
  updateMetrics();
  setInterval(updateMetrics, env.MELI_PROMETHEUS_REFRESH_RATE);
}

export async function setupPrometheus(
  app: Application,
  host: string,
  port: number,
): Promise<void> {
  logger.debug('Configuring prometheus');

  // register promster middleware to get metrics about node process (CPU...)
  app.use(createMiddleware({
    app: app as any,
    // TODO can we set metrics prefix here ?
    options: {},
  }));

  registerCustomMetrics();

  // inspired from https://github.com/tdeekens/promster/blob/master/packages/server/modules/server/server.ts
  const server = createServer((req, res) => {
    logger.debug('Metrics fetched');
    res.writeHead(200, 'OK', {
      'content-type': client.register.contentType,
    });
    res.end(client.register.metrics());
  });

  server.listen(port, host, () => {
    logger.info(`Metrics server listening on port ${chalk.green(port)}`);
  });
}
