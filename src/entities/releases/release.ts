import { AppDb } from '../../db/db';

export interface Release {
  _id: string;
  siteId: string;
  name: string;
  date: Date;
  branches: string[];
}

export const Releases = () => AppDb.db.collection<Release>('releases');
