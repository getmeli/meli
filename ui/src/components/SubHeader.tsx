import React from 'react';
import classNames from 'classnames';
import styles from './SubHeader.module.scss';

export function SubHeader({ children, className }: { children?: any; className: string }) {
  return (
    <div className={classNames(styles.header, className)}>
      {children}
    </div>
  );
}
