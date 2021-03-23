import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import styles from './SignInWithGoogle.module.scss';
import { useEnv } from '../../../providers/EnvProvider';
import { SignInButton } from './SignInButton';

export function SignInWithGoogle({ className }: {
  className?: any;
}) {
  const env = useEnv();
  return (
    <a
      href={`${env.MELI_API_URL}/auth/google`}
      className={className}
    >
      <SignInButton
        icon={(
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faGoogle} className="d-block w-100" />
          </div>
        )}
        label="Google"
        className={styles.google}
      />
    </a>
  );
}
