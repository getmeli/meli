import { Db, MongoClient } from 'mongodb';
import { rollBackwards } from './roll-backwards';
import { rollForward } from './roll-forward';
import { Logger } from '../../commons/logger/logger';
import { env } from '../../env';

const logger = new Logger('meli.server:migrate.migrate');

// https://github.com/seppevs/migrate-mongo#api-usage
export async function migrate(client: MongoClient, db: Db): Promise<void> {
  if (env.MELI_MIGRATE_ROLLBACK) {
    await rollBackwards(db, client);
    logger.debug('Exiting after rollback');
    process.exit(0);
  } else {
    await rollForward(db, client);
  }
}
