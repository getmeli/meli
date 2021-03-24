import { AppDb } from '../../db/db';

export interface Member {
  _id: string;
  orgId: string;
  userId: string;
  admin: boolean;
  name: string;
  email: string;
}

export const Members = () => AppDb.db.collection<Member>('members');
