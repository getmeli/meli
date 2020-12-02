import { Collection, CommandCursor, MongoError } from 'mongodb';
import { configureIndexesForCollection } from './create-indexes-for-collection';
import { MongoErrorCode } from './mongo-error-code';
import SpyInstance = jest.SpyInstance;

describe('configureIndexesForCollection', () => {
  let collection: Collection;

  beforeEach(() => {
    collection = {
      dropIndex: jest.fn(),
      createIndex: jest.fn(),
      listIndexes: () => ({ toArray: () => Promise.resolve([]) }) as Partial<CommandCursor> as any,
    } as Partial<Collection> as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should compute index name when not defined', async () => {
    await configureIndexesForCollection(collection, [
      { fieldOrSpec: 'field' },
    ]);

    expect(collection.createIndex).toHaveBeenCalledWith('field', { name: 'field' });
  });

  it('should compute index name when not defined (multi key)', async () => {
    await configureIndexesForCollection(collection, [
      {
        fieldOrSpec: {
          field1: 1.0,
          field2: 1.0,
        },
      },
    ]);

    expect(collection.createIndex).toHaveBeenCalledWith({
      field1: 1.0,
      field2: 1.0,
    }, { name: 'field1_field2' });
  });

  it('should use given index name', async () => {
    await configureIndexesForCollection(collection, [
      { fieldOrSpec: 'field', options: { name: 'name' } },
    ]);

    expect(collection.createIndex).toHaveBeenCalledWith('field', { name: 'name' });
  });

  it('should replace existing index with same name', async () => {
    let callCount = 0;
    jest.spyOn(collection, 'createIndex').mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        throw new MongoError({ code: MongoErrorCode.INDEX_OPTIONS_CONFLICT });
      }
    });

    jest.spyOn(collection, 'listIndexes').mockReturnValue({ toArray: () => Promise.resolve([{ name: 'field' }]) } as Partial<CommandCursor> as any);

    await configureIndexesForCollection(collection, [
      { fieldOrSpec: 'field' },
    ]);

    expect(collection.dropIndex).toHaveBeenCalledWith('field');
    expect((collection.createIndex as any as SpyInstance).mock.calls).toEqual([
      ['field', { name: 'field' }],
      ['field', { name: 'field' }],
    ]);
  });

  it('should replace existing index with conflicting key specs', async () => {
    let callCount = 0;
    jest.spyOn(collection, 'createIndex').mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        throw new MongoError({ code: MongoErrorCode.INDEX_KEY_SPECS_CONFLICT });
      }
    });

    jest.spyOn(collection, 'listIndexes').mockReturnValue({ toArray: () => Promise.resolve([{ name: 'field' }]) } as Partial<CommandCursor> as any);

    await configureIndexesForCollection(collection, [
      { fieldOrSpec: 'field' },
    ]);

    expect(collection.dropIndex).toHaveBeenCalledWith('field');
    expect((collection.createIndex as any as SpyInstance).mock.calls).toEqual([
      ['field', { name: 'field' }],
      ['field', { name: 'field' }],
    ]);
  });

  it('should replace existing text index', async () => {
    let callCount = 0;
    jest.spyOn(collection, 'createIndex').mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        throw new MongoError({ code: MongoErrorCode.INDEX_KEY_SPECS_CONFLICT });
      }
    });

    jest.spyOn(collection, 'listIndexes').mockReturnValue({
      toArray: () => Promise.resolve([{
        name: 'field',
        textIndexVersion: 3,
      }]),
    } as Partial<CommandCursor> as any);

    await configureIndexesForCollection(collection, [
      { fieldOrSpec: { prop: 'text' } },
    ]);

    console.log((collection.createIndex as any as SpyInstance).mock.calls);

    expect(collection.dropIndex).toHaveBeenCalledWith('field');
    expect((collection.createIndex as any as SpyInstance).mock.calls).toEqual([
      [{ prop: 'text' }, { name: 'prop' }],
      [{ prop: 'text' }, { name: 'prop' }],
    ]);
  });

  it('should replace existing index with different name but same keys', async () => {
    let callCount = 0;
    jest.spyOn(collection, 'createIndex').mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        throw new MongoError({ code: 85 });
      }
    });

    const indexList = [
      [{
        name: 'index1',
        key: { field: 1.0 },
      }],
      [],
    ];
    jest.spyOn(collection, 'listIndexes').mockReturnValue({ toArray: jest.fn().mockImplementation(() => indexList.reverse().pop()) } as Partial<CommandCursor> as any);

    await configureIndexesForCollection(collection, [
      { fieldOrSpec: 'field' },
    ]);

    expect(collection.dropIndex).toHaveBeenCalledWith('index1');
    expect((collection.createIndex as any as SpyInstance).mock.calls).toEqual([
      ['field', { name: 'field' }],
      ['field', { name: 'field' }],
    ]);
  });

  it('should replace existing text index with different name but same keys', async () => {
    let callCount = 0;
    jest.spyOn(collection, 'createIndex').mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        throw new MongoError({ code: 85 });
      }
    });

    const indexList = [
      [{
        name: 'index1',
        weights: { field: 1.0 },
      }],
      [],
    ];
    jest.spyOn(collection, 'listIndexes').mockReturnValue({ toArray: jest.fn().mockImplementation(() => indexList.reverse().pop()) } as Partial<CommandCursor> as any);

    await configureIndexesForCollection(collection, [
      { fieldOrSpec: 'field' },
    ]);

    expect(collection.dropIndex).toHaveBeenCalledWith('index1');
    expect((collection.createIndex as any as SpyInstance).mock.calls).toEqual([
      ['field', { name: 'field' }],
      ['field', { name: 'field' }],
    ]);
  });

  it('should rethrow error when cannot create index', async () => {
    jest.spyOn(collection, 'createIndex').mockImplementation(() => {
      throw new MongoError('');
    });

    let error: any;
    try {
      await configureIndexesForCollection(collection, [
        { fieldOrSpec: 'field' },
      ]);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('should drop indexes that are not specified anymore', async () => {
    jest.spyOn(collection, 'listIndexes').mockReturnValue({
      toArray: () => Promise.resolve([
        { name: 'name' },
      ]),
    } as Partial<CommandCursor> as any);

    await configureIndexesForCollection(collection, []);

    expect(collection.dropIndex).toHaveBeenCalledWith('name');
  });

  it('should not drop native id index', async () => {
    jest.spyOn(collection, 'listIndexes').mockReturnValue({
      toArray: () => Promise.resolve([
        { name: '_id_' },
      ]),
    } as Partial<CommandCursor> as any);

    await configureIndexesForCollection(collection, []);

    expect(collection.dropIndex).not.toHaveBeenCalled();
  });
})
;
