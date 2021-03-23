import React from 'react';
import { Loader } from './Loader';

export function Button({
  loading,
  className,
  children,
  onClick,
  disabled,
  type = 'button',
}: {
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: (event) => any;
  disabled?: boolean;
  children: any;
  [key: string]: any;
}) {
  const onButtonClick = event => {
    if (onClick) {
      onClick(event);
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <>
      <button type={type} className={className ?? 'btn btn-primary'} disabled={loading || disabled} onClick={onButtonClick}>
        {children}
        {loading && <Loader className="ml-2" />}
      </button>
    </>
  );
}
