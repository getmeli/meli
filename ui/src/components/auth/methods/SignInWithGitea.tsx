import React from 'react';
import { useEnv } from '../../../providers/EnvProvider';
import styles from './SignInWithGitea.module.scss';
import giteaLogo from '../../../assets/images/git-servers/gitea.svg';
import { SignInButton } from './SignInButton';

export function SignInWithGitea({ className }: {
  className?: any;
}) {
  const env = useEnv();
  return (
    <a
      href={`${env.MELI_API_URL}/auth/gitea`}
      className={className}
    >
      <SignInButton
        icon={(
          <img
            src={giteaLogo}
            alt="gitea-logo"
            className={styles.icon}
          />
        )}
        label="Gitea"
        className={styles.gitea}
      />
    </a>
  );
}
