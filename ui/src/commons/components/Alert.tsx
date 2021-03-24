import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import classNames from 'classnames';
import {
  faCheck, faExclamation, faInfo, faTimes,
} from '@fortawesome/free-solid-svg-icons';
import styles from './Alert.module.scss';

function getIcon(type: string) {
  switch (type) {
    case 'info':
      return <FontAwesomeIcon icon={faInfo} />;
    case 'danger':
      return <FontAwesomeIcon icon={faTimes} />;
    case 'success':
      return <FontAwesomeIcon icon={faCheck} />;
    case 'warning':
    default:
      return <FontAwesomeIcon icon={faExclamation} />;
  }
}

export function Alert({
  type = 'info',
  children,
  className,
}: {
  type?: 'info' | 'danger' | 'warning' | 'success';
  children: any;
  className?: string;
}) {
  const icon = getIcon(type);

  return (
    <div className={classNames('alert', styles.alert, `alert-${type}`, className)}>
      <div className={styles.icon}>{icon}</div>
      <div className={`${styles.content} align-self-center`}>{children}</div>
    </div>
  );
}
