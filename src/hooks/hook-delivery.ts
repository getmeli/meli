import { AppDb } from '../db/db';
import { HookType } from './hook';

export interface HookDelivery<T = any> {
  _id: string;
  hookId: string;
  type: HookType;
  date: Date;
  data?: T;
  success: boolean;
  error?: string;
}

export const HookDeliveries = () => AppDb.db.collection<HookDelivery>('hook-deliveries');
