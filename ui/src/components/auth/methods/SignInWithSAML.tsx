import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styles from './SignInWithSAML.module.scss';
import { SignInButton } from './SignInButton';

export function SignInWithSAML({ className }: {
  className?: any;
}) {
  return (
    <a
      href="/auth/saml"
      rel="noreferrer noopener"
      className={className}
    >
      <SignInButton
        icon={(
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faKey} className="d-block w-100"/>
          </div>
        )}
        label="Single Signon"
        className={styles.SSO}
      />
    </a>
  );
}
