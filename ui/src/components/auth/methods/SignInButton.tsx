import classNames from 'classnames';
import React from 'react';
import styles from './SignInButton.module.scss';

export function SignInButton({
  onClick, label, icon, className,
}: {
  onClick?: any;
  label: any;
  icon: any;
  className?: any;
}) {
  return (
    <button
      className={classNames(styles.container, className)}
      onClick={onClick}
    >
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
          {icon}
        </div>
      </div>
      <span className={styles.label}>
        {label}
      </span>
    </button>
  );
}
