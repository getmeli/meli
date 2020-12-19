import { authMethods } from './passport/auth-methods';
import './passport/github';
import './passport/gitlab';
import './passport/gitea';
import './passport/google';
import './passport/saml';
import './passport/in-memory';

if (authMethods.length === 0) {
  throw new Error('No auth methods enabled, please configure one');
}
