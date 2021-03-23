import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Loader } from '../../commons/components/Loader';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import styles from './SignIn.module.scss';
import { ErrorIcon } from '../../commons/components/ErrorIcon';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { SignInWithGitea } from './methods/SignInWithGitea';
import { SignInWithGitlab } from './methods/SignInWithGitlab';
import { SignInWithGithub } from './methods/SignInWithGithub';
import { SignInWithGoogle } from './methods/SignInWithGoogle';
import { SignInWithUserPassword } from './methods/SignInWithUserPassword';

export function SignIn() {
  const env = useEnv();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [signInMethods, setSignInMethods] = useState<string[]>();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${env.MELI_API_URL}/auth/methods`)
      .then(({ data }) => data)
      .then(setSignInMethods)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, setLoading]);

  return loading ? (
    <Loader />
  ) : error ? (
    <ErrorIcon error={error} />
  ) : (
    <div className={classNames(styles.container)}>
      <div className="container">
        <div className="row">
          <div className="col d-flex justify-content-center">
            <div className={styles.grid}>
              <h1 className={styles.title}>
                meli
              </h1>
              <p className="text-center mb-4">
                Shipping frontend
              </p>
              {signInMethods.includes('in-memory') && (
                <SignInWithUserPassword className="mb-4" />
              )}
              {signInMethods.includes('gitlab') && (
                <SignInWithGitlab />
              )}
              {signInMethods.includes('github') && (
                <SignInWithGithub />
              )}
              {signInMethods.includes('gitea') && (
                <SignInWithGitea />
              )}
              {signInMethods.includes('google') && (
                <SignInWithGoogle />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
