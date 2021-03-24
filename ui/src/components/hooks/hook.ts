export enum HookType {
  email = 'email',
  mattermost = 'mattermost',
  slack = 'slack',
  web = 'web',
}

export interface Hook {
  _id: string;
  name: string;
  type: HookType;
  createdAt: Date;
  updatedAt: Date;
  config: any;
  events: string[];
}
