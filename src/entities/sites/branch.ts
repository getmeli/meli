import { string } from 'joi';
import { STRING_MAX_LENGTH, SUBDOMAIN_PATTERN } from '../../constants';
import { Redirect } from './redirect';

export interface BranchPassword {
  hash: string;
  salt: string;
}

export interface Branch {
  _id: string;
  name: string;
  slug: string;
  release?: string;
  password?: BranchPassword;
  redirects?: Redirect[];
}

export const $channelName = string().required().regex(SUBDOMAIN_PATTERN).max(STRING_MAX_LENGTH);
