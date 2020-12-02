import { EventType } from '../events/app-event';
import {
  array, object, string,
} from 'joi';
import { enumToArray } from '../commons/enum-to-array';
import { $emailHookConfig } from './handlers/email/handle-email-hook';
import { $mattermostHookConfig } from './handlers/mattermost/send-mattermost-message';
import { $slackHookConfig } from './handlers/slack/send-slack-message';
import { AppDb } from '../db/db';
import { STRING_MAX_LENGTH } from '../constants';
import { $webhookConfig } from './handlers/web/deliver-web-hook';

export enum HookType {
  email = 'email',
  mattermost = 'mattermost',
  slack = 'slack',
  web = 'web',
}

export interface Hook<T = any> {
  _id: string;
  name: string;
  type: HookType;
  config: T;
  events: EventType[];
  createdAt: Date;
  updatedAt?: Date;
}

export const Hooks = () => AppDb.db.collection<Hook>('hook');

export const $hookEvents = array().required().min(0);
export const $hookEvent = string().required();

export const $hook = object({
  name: string().optional().empty('').max(STRING_MAX_LENGTH),
  type: string().required().valid(...enumToArray(HookType)),
  config: object()
    .when('type', {
      is: HookType.email,
      then: $emailHookConfig,
    })
    .when('type', {
      is: HookType.mattermost,
      then: $mattermostHookConfig,
    })
    .when('type', {
      is: HookType.slack,
      then: $slackHookConfig,
    })
    .when('type', {
      is: HookType.web,
      then: $webhookConfig,
    }),
  events: $hookEvents.items(
    $hookEvent.valid(...enumToArray(EventType)),
  ),
});
