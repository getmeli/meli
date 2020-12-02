import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { getUser } from '../../../auth/utils/get-user';
import { Users } from '../user';

async function handler(req: Request, res: Response) {
  const user = getUser(req);

  await Users().updateOne({
    _id: user._id,
  }, {
    $set: {
      invalidateTokensAt: Date.now(),
    },
  });

  res.status(204).send();
}

export const invalidateTokens = [
  wrapAsyncMiddleware(handler),
];
