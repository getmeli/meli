import React from 'react';
import { useEnv } from '../../../providers/EnvProvider';
import styles from './SignInWithGitHub.module.scss';
import githubLogo from '../../../assets/images/git-servers/github.svg';
import { SignInButton } from './SignInButton';

export function SignInWithGithub({ className }: {
  className?: any;
}) {
  const env = useEnv();
  return (
    <a
      href={`${env.MELI_API_URL}/auth/github`}
      className={className}
    >
      <SignInButton
        icon={(
          <img
            src={githubLogo}
            alt="github-logo"
            className="d-block w-100"
          />
        )}
        label="Github"
        className={styles.github}
      />
    </a>
  );
}
