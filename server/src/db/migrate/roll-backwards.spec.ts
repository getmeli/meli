import { Db, MongoClient } from 'mongodb';
import { down } from 'migrate-mongo';
import { rollBackwards } from './roll-backwards';

jest.mock('migrate-mongo');

describe('rollBackwards', () => {
  let db: Db;
  let client: MongoClient;

  beforeEach(() => {
    db = {} as any;
    client = {} as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should run migration', async () => {
    await rollBackwards(db, client);
    expect(down).toHaveBeenCalledWith(db, client);
  });
});
