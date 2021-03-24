import { Request, Response } from 'express';

export function noContent(req: Request, res: Response) {
  res.status(204).send();
}
