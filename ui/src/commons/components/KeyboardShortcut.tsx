import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard } from '@fortawesome/free-regular-svg-icons';
import styles from './KeyboardShortcut.module.scss';

export function KeyboardShortcut({
  children, className, icon = true,
}: { children; className?; icon?: boolean }) {
  return (
    <div className={classNames(styles.shortcut, className)}>
      {icon && (
        <FontAwesomeIcon icon={faKeyboard} className={styles.icon} />
      )}
      {children}
    </div>
  );
}
