import { Db, MongoClient } from 'mongodb';
import { env } from '../env/env';
import { buildMongoUri } from './build-mongo-uri';

const url = env.MELI_MONGO_URI || buildMongoUri();

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export class AppDb {
  static client: MongoClient;

  static db: Db;

  static async init(): Promise<void> {
    await client.connect();
    AppDb.db = client.db();
    AppDb.client = client;
  }
}
