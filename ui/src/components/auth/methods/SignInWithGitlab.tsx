import React from 'react';
import { useEnv } from '../../../providers/EnvProvider';
import styles from './SignInWithGitlab.module.scss';
import gitlabLogo from '../../../assets/images/git-servers/gitlab.svg';
import { SignInButton } from './SignInButton';

export function SignInWithGitlab({ className }: {
  className?: any;
}) {
  const env = useEnv();
  return (
    <a
      href={`${env.MELI_API_URL}/auth/gitlab`}
      className={className}
    >
      <SignInButton
        icon={(
          <img
            src={gitlabLogo}
            alt="gitlab-logo"
            className="d-block w-100"
          />
        )}
        label="Gitlab"
        className={styles.gitlab}
      />
    </a>
  );
}
