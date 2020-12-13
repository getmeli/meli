import { Router } from 'express';
import passport from 'passport';
import { authenticate } from './authenticate';
import { signOut } from './handlers/sign-out';
import { apiEndpoint } from '../entities/api/api-endpoint';
import { getAuthMethods } from './handlers/get-auth-methods';
import { google_callback, google_redirect } from './passport/google';
import { oidc_callback, oidc_redirect } from './passport/oidc';
import { gitea_callback, gitea_redirect } from './passport/gitea';
import { github_callback, github_redirect } from './passport/github';
import { gitlab_callback, gitlab_redirect } from './passport/gitlab';
import { redirectToUi } from './handlers/redirect-to-ui';
import { noContent } from '../commons/express/handlers/no-content';

const router = Router();

const passportOptions = {
  session: false,
};

// TODO could this be moved to the "new GoogleStrategy(...)" ?
const oidOptions = {
  scope: [
    'userinfo.profile',
    'userinfo.email',
  ],
};

// passport
router.get(gitlab_redirect, passport.authenticate('gitlab'));
router.get(gitlab_callback, passport.authenticate('gitlab', passportOptions), authenticate, redirectToUi);
router.get(gitea_redirect, passport.authenticate('gitea'));
router.get(gitea_callback, passport.authenticate('gitea', passportOptions), authenticate, redirectToUi);
router.get(google_redirect, passport.authenticate('google', oidOptions)); // google is a special case of oidc
router.get(google_callback, passport.authenticate('google', passportOptions), authenticate, redirectToUi);
router.get(oidc_redirect, passport.authenticate('oidc', oidOptions));
router.get(oidc_callback, passport.authenticate('oidc', passportOptions), authenticate, redirectToUi);
router.get(github_redirect, passport.authenticate('github'));
router.get(github_callback, passport.authenticate('github', passportOptions), authenticate, redirectToUi);
router.post('/auth/in-memory', passport.authenticate('in-memory', passportOptions), authenticate, noContent);

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
