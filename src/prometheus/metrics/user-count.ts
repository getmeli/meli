import { Prometheus } from '@promster/express';
import { env } from '../../env';
import { Users } from '../../entities/users/user';

const counter = new Prometheus.Gauge({
  name: `${env.MELI_PROMETHEUS_METRICS_PREFIX}user_count`,
  help: 'Total number of users',
});

export function userCount(): Promise<void> {
  return Users()
    .estimatedDocumentCount({})
    .then(res => {
      counter.set(res);
    });
}
