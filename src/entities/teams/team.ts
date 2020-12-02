import { AppDb } from '../../db/db';

export interface Team {
  _id: string;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  color: string;
  members: string[];
  hooks: string[];
}

export const Teams = () => AppDb.db.collection<Team>('teams');

export function teamSocketRoom(id: string): string {
  return `team.${id}`;
}
