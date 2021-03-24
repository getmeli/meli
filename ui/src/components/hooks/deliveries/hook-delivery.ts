import { HookType } from '../hook';

export interface HookDelivery {
  _id: string;
  type: HookType;
  hookId: string;
  date: Date;
  data: string;
  success: string;
  error: string;
}
