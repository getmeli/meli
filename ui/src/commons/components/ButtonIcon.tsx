import React from 'react';
import classNames from 'classnames';
import styles from './ButtonIcon.module.scss';
import { Loader } from './Loader';

export function ButtonIcon({
  children, className, onClick, loading, ...props
}: {
  children: any;
  className?: string;
  onClick?: (ev) => void;
  loading?: boolean;
  [props: string]: any;
}) {
  return (
    <div
      className={classNames(styles.container, className)}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader />
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
