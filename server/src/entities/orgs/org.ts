import { AppDb } from '../../db/db';
import { Invite } from './invite';
import { StoredFile } from '../../storage/store-file';

export interface Org {
  _id: string;
  color: string;
  logo?: StoredFile;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  name: string;
  invites: Invite[];
  hooks: string[];
}

export const Orgs = () => AppDb.db.collection<Org>('orgs');
