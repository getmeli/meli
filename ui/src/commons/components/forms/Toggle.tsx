import React from 'react';
import classNames from 'classnames';
import styles from './Toggle.module.scss';
import { Loader } from '../Loader';

export function Toggle({
  value,
  onChange,
  togglePosition = 'right',
  disabled,
  loading,
  children,
  disableClick,
  className,
}: {
  value?: boolean;
  onChange?: (isOn: boolean) => void;
  togglePosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  children?: any;
  disableClick?: any;
  className?: any;
}) {
  const toggle = () => {
    if (disabled || disableClick) {
      return;
    }
    if (onChange) {
      onChange(!value);
    }
  };

  const icon = (
    <div className={classNames(styles.icon, {
      [styles.on]: value,
    })}
    >
      <div className={`${styles['bg-on']} ${styles.bg}`} />
      <div className={`${styles['bg-off']} ${styles.bg}`} />
      <div className={styles.knob}>
        {loading && (
          <Loader className={styles.loader} />
        )}
      </div>
    </div>
  );

  return (
    <div
      className={classNames(
        'd-flex align-items-center cursor-pointer justify-content-between',
        className,
        styles.container,
        {
          [styles.disabled]: disabled,
        },
      )}
      onClick={toggle}
    >
      {togglePosition === 'left' ? (
        <>
          <div className="mr-2">
            {icon}
          </div>
          {children}
        </>
      ) : (
        <>
          <div className="d-flex flex-grow-1">
            {children}
          </div>
          <div className="ml-2">
            {icon}
          </div>
        </>
      )}
    </div>
  );
}
