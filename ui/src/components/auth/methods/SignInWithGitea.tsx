import React from 'react';
import styles from './SignInWithGitea.module.scss';
import giteaLogo from '../../../assets/images/git-servers/gitea.svg';
import { SignInButton } from './SignInButton';

export function SignInWithGitea({ className }: {
  className?: any;
}) {
  return (
    <a
      href={`/auth/gitea`}
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
