import { Link } from 'react-router-dom';
import React from 'react';
import classNames from 'classnames';
import styles from './DropdownLink.module.scss';

const defaultIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill="#EEECF9" />
  </svg>
);

export function DropdownLink({
  to, children, icon, onClick, disabled = false, className,
}: {
  to?: string;
  onClick?: (e?) => void;
  children: any;
  icon?: any;
  disabled?: boolean;
  className?: any;
}) {
  const content = (
    <>
      <div className={classNames(styles.icon)}>
        {icon || defaultIcon}
      </div>
      <div className="d-flex flex-shrink-0">
        {children}
      </div>
    </>
  );
  return to ? (
    // TODO not sure you can use disabled prop as done here, might throw error when Link.to is undefined
    <Link className={classNames(styles.link, className)} to={disabled ? undefined : to}>
      {content}
    </Link>
  ) : (
    <div
      className={classNames(styles.link, className, {
        [styles.disabled]: disabled,
      })}
      onClick={ev => {
        if (disabled) {
          ev.stopPropagation();
        } else if (onClick) {
          onClick(ev);
        }
      }}
    >
      {content}
    </div>
  );
}
