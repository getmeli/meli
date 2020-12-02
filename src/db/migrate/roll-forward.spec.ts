import { Db, MongoClient } from 'mongodb';
import { up } from 'migrate-mongo';
import { rollForward } from './roll-forward';

jest.mock('migrate-mongo');

describe('rollforward', () => {
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
    await rollForward(db, client);

    expect(up).toHaveBeenCalledWith(db, client);
  });
});
