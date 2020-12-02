import { AppDb } from '../../db/db';
import { Invite } from './invite';

export interface Org {
  _id: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  name: string;
  invites: Invite[];
  hooks: string[];
}

export const Orgs = () => AppDb.db.collection<Org>('orgs');

export function orgSocketRoom(id: string): string {
  return `org.${id}`;
}
