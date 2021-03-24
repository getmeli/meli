import request from 'supertest';
import express, { Express } from 'express';
import { spyOnCollection } from '../../../../tests/utils/spyon-collection';
import { Server } from 'http';
import { apiTokenExistsGuard } from './api-token-exists-guard';

describe('apiTokenExistsGuard', () => {

  let app: Express;
  let server: Server;

  beforeEach(async () => {
    app = express();
    app.use('/:apiTokenId', apiTokenExistsGuard, (req, res) => {
      res.status(200).send();
    });
    server = app.listen(3000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.close();
  });

  it('should be ok when api token exists', async () => {
    const ApiTokens = spyOnCollection('ApiTokens', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
    });

    const response = await request(app)
      .get('/id')
      .send();

    expect(response.status).toEqual(200);
    expect(ApiTokens.countDocuments).toHaveBeenCalledWith({
      _id: 'id',
    }, {
      limit: 1,
    });
  });

  it('should throw error when token not found', async () => {
    spyOnCollection('ApiTokens', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(0)),
    });

    const response = await request(app)
      .get('/id')
      .send();

    expect(response.status).toEqual(404);
  });

});
