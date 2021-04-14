import { Request } from 'express';
import { Sites } from '../site';

export async function isSiteTokenValid(siteId: string, req: Request): Promise<boolean> {
  const token = req.headers['x-meli-token'] as string;

  if (!token) {
    return false;
  }

  const site = await Sites().findOne({
    _id: siteId,
  });

  return site.tokens.some(({ value }) => value === token);
}
