import { Db, MongoClient } from 'mongodb';
import { configureIndexes } from './configure-indexes';
import * as _configureIndexesForCollection from './create-indexes-for-collection';
import SpyInstance = jest.SpyInstance;

describe('configure-indexes', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetModules();
  });

  describe('configureIndexes', () => {
    let db: Db;
    let client: MongoClient;
    let configureIndexesForCollection: SpyInstance;

    beforeEach(() => {
      db = {
        collections: jest.fn(),
        collection: jest.fn(),
        createCollection: jest.fn(),
      } as any;
      client = { db: jest.fn().mockReturnValue(db) } as Partial<MongoClient> as any;

      configureIndexesForCollection = jest.spyOn(_configureIndexesForCollection, 'configureIndexesForCollection').mockReturnValue(Promise.resolve());
    });

    it('should create registered indexes', async () => {
      const indexes = {
        collection1: [
          { fieldOrSpec: 'test1' },
        ],
        collection2: [
          { fieldOrSpec: 'test2' },
        ],
      };

      jest.spyOn(db, 'collections').mockImplementation(() => Promise.resolve([
        { collectionName: 'collection1' },
        { collectionName: 'collection2' },
      ]));

      await configureIndexes(client, indexes);

      expect(configureIndexesForCollection.mock.calls).toEqual([
        [{ collectionName: 'collection1' }, [
          { fieldOrSpec: 'test1' },
        ]],
        [{ collectionName: 'collection2' }, [
          { fieldOrSpec: 'test2' },
        ]],
      ]);
    });

    it('should create collection when it does not exist', async () => {
      jest.spyOn(db, 'collections').mockImplementation(() => Promise.resolve(['collection1']));
      const createCollection = jest.spyOn(db, 'createCollection').mockImplementation(() => Promise.resolve('collection1'));

      const indexes = {
        collection1: [
          { fieldOrSpec: 'test1' },
        ],
      };

      await configureIndexes(client, indexes);

      expect(createCollection).toHaveBeenCalledWith('collection1');
      expect(configureIndexesForCollection.mock.calls).toEqual([
        ['collection1', [
          { fieldOrSpec: 'test1' },
        ]],
      ]);
    });
  });
});
