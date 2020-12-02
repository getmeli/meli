import { Db, MongoClient } from 'mongodb';
import chalk from 'chalk';
import { up } from 'migrate-mongo';
import { Logger } from '../../commons/logger/logger';

const logger = new Logger('meli.server:migrate.rollForward');

export async function rollForward(db: Db, client: MongoClient): Promise<void> {
  logger.debug('Rolling forward');
  const migrated: any[] = await up(db, client);
  if (migrated?.length > 0) {
    migrated.forEach(fileName => logger.info(`Migrated ${chalk.bold(fileName)}`));
  } else {
    logger.info('Nothing to migrate');
  }
}
