import { authMethods } from './passport/auth-methods';

require('./passport/github');
require('./passport/gitlab');
require('./passport/gitea');
require('./passport/google');

if (authMethods.length === 0) {
  throw new Error('No auth methods enabled, please configure one');
}
