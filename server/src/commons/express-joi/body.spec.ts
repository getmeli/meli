import request from 'supertest';
import express, { Express } from 'express';
import { Server } from 'http';
import { number, object } from 'joi';
import { body } from './body';
import { json } from 'body-parser';

describe('body', () => {

  let app: Express;
  let server: Server;
  let b: any;

  beforeEach(async () => {
    app = express();
    app.use(json());
    app.use(
      '*',
      body(object({
        test: number().required(),
      })),
      (req, res) => {
        b = req.body;
        res.status(200).send();
      },
    );
    server = app.listen(3000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.close();
  });

  it('should be ok when params are valid', async () => {
    const response = await request(app)
      .post('/')
      .send({
        test: 1,
      });

    expect(response.status).toEqual(200);
    expect(b.test).toEqual(1);
  });

  it('should throw error when token not found', async () => {
    const response = await request(app)
      .post('/')
      .send({});

    expect(response.status).toEqual(400);
  });

});
