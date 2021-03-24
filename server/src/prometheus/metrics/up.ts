import { Prometheus } from '@promster/express';
import { env } from '../../env/env';

const gauge = new Prometheus.Gauge({
  name: `${env.MELI_PROMETHEUS_METRICS_PREFIX}up`,
  help: 'Whether the server is up or down',
});

export async function up(): Promise<void> {
  gauge.set(1);
}
