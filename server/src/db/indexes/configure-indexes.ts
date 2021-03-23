import { Collection, Db, IndexOptions, MongoClient } from 'mongodb';
import { configureIndexesForCollection } from './create-indexes-for-collection';

export type FieldOrSpec =
  string
  | { [fieldName: string]: any };

export interface MongoIndexSpec {
  fieldOrSpec: FieldOrSpec;
  options?: IndexOptions;
}

async function createCollectionIfNotExists(name: string, db: Db): Promise<Collection> {
  const collections = await db.collections();
  const collection = collections.find(col => col.collectionName === name);
  return collection || db.createCollection(name);
}

export async function configureIndexes(client: MongoClient, collectionIndexes: { [collectionName: string]: MongoIndexSpec[] }) {
  const db = client.db();

  // eslint-disable-next-line no-restricted-syntax
  for (const collectionName of Object.keys(collectionIndexes)) {
    // eslint-disable-next-line no-await-in-loop
    const collection = await createCollectionIfNotExists(collectionName, db);
    const indexes = collectionIndexes[collectionName];
    // eslint-disable-next-line no-await-in-loop
    await configureIndexesForCollection(collection, indexes);
  }
}
