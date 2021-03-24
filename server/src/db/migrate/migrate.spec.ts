import { Db, MongoClient } from 'mongodb';
import { migrate } from './migrate';
import * as _rollback from './roll-backwards';
import * as _rollup from './roll-forward';
import { env } from '../../env/env';

jest.mock('../../env/env', () => ({ env: {} }));
import SpyInstance = jest.SpyInstance;

jest.mock('migrate-mongo');

describe('migrate', () => {
  let db: Db;
  let client: MongoClient;

  let rollForward: SpyInstance;
  let rollbackwards: SpyInstance;
  let processExit: SpyInstance;

  beforeEach(() => {
    db = {} as any;
    client = { close: jest.fn().mockReturnValue(Promise.resolve()) } as any;

    rollForward = jest.spyOn(_rollup, 'rollForward').mockReturnValue(Promise.resolve());
    rollbackwards = jest.spyOn(_rollback, 'rollBackwards').mockReturnValue(Promise.resolve());
    processExit = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    delete env.MELI_MIGRATE_ROLLBACK;
  });

  it('should rollForward', async () => {
    await migrate(client, db);

    expect(rollForward).toHaveBeenCalledWith(db, client);
    expect(rollbackwards).not.toHaveBeenCalled();
  });

  it('should rollBackwards and exit when rollback enabled', async () => {
    env.MELI_MIGRATE_ROLLBACK = true;

    await migrate(client, db);

    expect(rollbackwards).toHaveBeenCalledWith(db, client);
    expect(processExit).toHaveBeenCalledWith(0);
    expect(rollForward).not.toHaveBeenCalled();
  });
});
