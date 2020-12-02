import { Db, MongoClient } from 'mongodb';
import chalk from 'chalk';
import { down } from 'migrate-mongo';
import { Logger } from '../../commons/logger/logger';

const logger = new Logger('meli.server:migrate.rollBackwards');

export async function rollBackwards(db: Db, client: MongoClient): Promise<void> {
  logger.debug('Rolling back');
  const migratedDown = await down(db, client);
  if (migratedDown?.length > 0) {
    migratedDown.forEach(fileName => logger.info(`Rolled back migration: ${chalk.bold(fileName)}`));
  } else {
    logger.info('No migration to roll back');
  }
}
