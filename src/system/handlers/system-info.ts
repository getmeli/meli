import { Request, Response } from 'express';

export function systemInfo(req: Request, res: Response) {
  res.json(BUILD_INFO);
}
