import { Router } from 'express';
import {
  gitea_callback,
  gitea_redirect,
  github_callback,
  github_redirect,
  gitlab_callback,
  gitlab_redirect,
  google_callback,
  google_redirect,
} from './passport';
import passport from 'passport';
import { authenticate } from './utils/authenticate';
import { signOut } from './handlers/sign-out';
import { apiEndpoint } from '../entities/api/api-endpoint';
import { getAuthMethods } from './handlers/get-auth-methods';

const router = Router();

const passportOptions = {
  session: false,
};

const googleOptions = {
  scope: [
    'userinfo.profile',
    'userinfo.email',
  ],
};

// passport
router.get(gitlab_redirect, passport.authenticate('gitlab'));
router.get(gitlab_callback, passport.authenticate('gitlab', passportOptions), authenticate);
router.get(gitea_redirect, passport.authenticate('gitea'));
router.get(gitea_callback, passport.authenticate('gitea', passportOptions), authenticate);
router.get(google_redirect, passport.authenticate('google', googleOptions));
router.get(google_callback, passport.authenticate('google', passportOptions), authenticate);
router.get(github_redirect, passport.authenticate('github'));
router.get(github_callback, passport.authenticate('github', passportOptions), authenticate);

// auth
apiEndpoint({
  name: 'sign out',
  method: 'post',
  path: '/auth/signout',
  handler: signOut,
  router,
});
apiEndpoint({
  name: 'get auth methods',
  method: 'get',
  path: '/auth/methods',
  handler: getAuthMethods,
  router,
});

export default router;
