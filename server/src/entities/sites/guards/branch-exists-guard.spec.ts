import request from 'supertest';
import express, { Express } from 'express';
import { spyOnCollection } from '../../../../tests/utils/spyon-collection';
import { Server } from 'http';
import { branchExistsGuard } from './branch-exists-guard';

describe('branchExistsGuard', () => {

  let app: Express;
  let server: Server;

  beforeEach(async () => {
    app = express();
    app.use('/:branchId', branchExistsGuard, (req, res) => {
      res.status(200).send();
    });
    server = app.listen(3000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.close();
  });

  it('should be ok when api token exists', async () => {
    const Sites = spyOnCollection('Sites', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
    });

    const response = await request(app)
      .get('/id')
      .send();

    expect(response.status).toEqual(200);
    expect(Sites.countDocuments).toHaveBeenCalledWith({
      'branches._id': 'id',
    }, {
      limit: 1,
    });
  });

  it('should be forbidden when token not owned by user', async () => {
    spyOnCollection('Sites', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(0)),
    });

    const response = await request(app)
      .get('/id')
      .send();

    expect(response.status).toEqual(404);
  });

});
