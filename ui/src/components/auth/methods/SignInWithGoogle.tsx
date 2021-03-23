import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import styles from './SignInWithGoogle.module.scss';
import { SignInButton } from './SignInButton';

export function SignInWithGoogle({ className }: {
  className?: any;
}) {
  return (
    <a
      href={`/auth/google`}
      className={className}
    >
      <SignInButton
        icon={(
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faGoogle} className="d-block w-100"/>
          </div>
        )}
        label="Google"
        className={styles.google}
      />
    </a>
  );
}
