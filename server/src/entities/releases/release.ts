import { AppDb } from '../../db/db';
import { Form } from '../forms/form';

export interface Release {
  _id: string;
  siteId: string;
  name: string;
  date: Date;
  branches: string[];
  forms?: Form[];
}

export const Releases = () => AppDb.db.collection<Release>('releases');
