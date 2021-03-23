import React from 'react';
import styles from './SignInWithGitHub.module.scss';
import githubLogo from '../../../assets/images/git-servers/github.svg';
import { SignInButton } from './SignInButton';

export function SignInWithGithub({ className }: {
  className?: any;
}) {
  return (
    <a
      href={`/auth/github`}
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
