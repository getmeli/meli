import { buildMongoUri } from './build-mongo-uri';
import { env } from '../env/env';

describe('buildMongoUri', () => {

  afterEach(() => {
    jest.restoreAllMocks();
    delete env.MELI_MONGO_HOST;
    delete env.MELI_MONGO_PORT;
    delete env.MELI_MONGO_USER;
    delete env.MELI_MONGO_PASSWORD;
    delete env.MELI_MONGO_DB;
  });

  it('should throw error when host not defined', async () => {
    env.MELI_MONGO_HOST = undefined;
    env.MELI_MONGO_PORT = 27017;
    env.MELI_MONGO_DB = 'db';
    expect(() => buildMongoUri()).toThrow();
  });

  it('should throw error when port not defined', async () => {
    env.MELI_MONGO_HOST = 'localhost';
    env.MELI_MONGO_PORT = undefined;
    env.MELI_MONGO_DB = 'db';
    expect(() => buildMongoUri()).toThrow();
  });

  it('should throw error when db not defined', async () => {
    env.MELI_MONGO_HOST = 'localhost';
    env.MELI_MONGO_PORT = 27017;
    env.MELI_MONGO_DB = undefined;
    expect(() => buildMongoUri()).toThrow();
  });

  it('should build url with host and port', async () => {
    env.MELI_MONGO_HOST = 'localhost';
    env.MELI_MONGO_PORT = 27017;
    env.MELI_MONGO_DB = 'db';
    expect(buildMongoUri()).toEqual('mongodb://localhost:27017/db');
  });

  it('should build url with user', async () => {
    env.MELI_MONGO_HOST = 'localhost';
    env.MELI_MONGO_PORT = 27017;
    env.MELI_MONGO_USER = 'user';
    env.MELI_MONGO_DB = 'db';
    expect(buildMongoUri()).toEqual('mongodb://user@localhost:27017/db');
  });

  it('should build url with user and password', async () => {
    env.MELI_MONGO_HOST = 'localhost';
    env.MELI_MONGO_PORT = 27017;
    env.MELI_MONGO_USER = 'user';
    env.MELI_MONGO_PASSWORD = 'password';
    env.MELI_MONGO_DB = 'db';
    expect(buildMongoUri()).toEqual('mongodb://user:password@localhost:27017/db');
  });

});
