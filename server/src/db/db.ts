import { Db, MongoClient } from 'mongodb';
import { env } from '../env/env';

const client = new MongoClient(env.MELI_MONGO_URI, {
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
