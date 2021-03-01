import request from 'supertest';
import express, { Express } from 'express';
import { Server } from 'http';
import { params } from './params';
import { number, object } from 'joi';

describe('params', () => {

  let app: Express;
  let server: Server;

  beforeEach(async () => {
    app = express();
    app.use(
      '/:test',
      params(object({
        test: number().required(),
      })),
      (req, res) => res.status(200).send(),
    );
    server = app.listen(3000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.close();
  });

  it('should be ok when params are valid', async () => {
    const response = await request(app)
      .get('/1')
      .send();

    expect(response.status).toEqual(200);
  });

  it('should throw error when token not found', async () => {
    const response = await request(app)
      .get('/test')
      .send();

    expect(response.status).toEqual(400);
  });

});
