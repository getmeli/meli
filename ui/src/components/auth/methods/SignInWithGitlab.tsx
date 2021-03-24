import React from 'react';
import styles from './SignInWithGitlab.module.scss';
import gitlabLogo from '../../../assets/images/git-servers/gitlab.svg';
import { SignInButton } from './SignInButton';

export function SignInWithGitlab({ className }: {
  className?: any;
}) {
  return (
    <a
      href={`/auth/gitlab`}
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
