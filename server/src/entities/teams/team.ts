import { AppDb } from '../../db/db';
import { StoredFile } from '../../storage/store-file';

export interface Team {
  _id: string;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  color: string;
  logo?: StoredFile;
  members: string[];
  hooks: string[];
}

export const Teams = () => AppDb.db.collection<Team>('teams');
