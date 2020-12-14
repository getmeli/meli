import { string } from 'joi';
import { STRING_MAX_LENGTH, SUBDOMAIN_PATTERN } from '../../constants';
import { Redirect } from './redirect';
import { Password } from './password';

export interface Branch {
  _id: string;
  name: string;
  slug: string;
  release?: string;
  password?: Password;
  redirects?: Redirect[];
}

export const $channelName = string().required().regex(SUBDOMAIN_PATTERN).max(STRING_MAX_LENGTH);
