import { v4 as uuid } from 'uuid';
import { postHogId } from './posthog';
import { sendHeartbeat } from './send-heartbeat';
import { AppDb } from '../db/db';

export interface AppInfo {
  _id: string;
  value: string;
}

export const AppInfos = () => AppDb.db.collection<AppInfo>('app-info');

const appInfoKey = 'install_id';

export async function initPosthog() {
  // id
  const appInfo = await AppInfos().findOne({ _id: appInfoKey });
  if (appInfo) {
    postHogId.id = appInfo.value;
  } else {
    postHogId.id = uuid();
    await AppInfos().insertOne({
      _id: appInfoKey,
      value: postHogId.id,
    });
  }

  // heartbeat
  sendHeartbeat();
  setInterval(sendHeartbeat, 86400000); // every day
}
