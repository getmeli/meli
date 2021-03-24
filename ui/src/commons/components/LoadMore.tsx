import React from 'react';
import classNames from 'classnames';
import styles from './LoadMore.module.scss';
import { Loader } from './Loader';

export function LoadMore({
  onClick, className, disabled, loading,
}: {
  onClick: (e: any) => void;
  disabled?: boolean;
  loading?: boolean;
  className?;
}) {
  return (
    <button
      type="button"
      className={classNames(styles.button, className, {
        [styles.disabled]: disabled,
      })}
      disabled={disabled}
      onClick={ev => !disabled && onClick(ev)}
    >
      Load more
      {loading && (
        <Loader className="ml-3" />
      )}
    </button>
  );
}
