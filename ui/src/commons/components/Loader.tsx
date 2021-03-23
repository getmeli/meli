import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export function Loader({ className, ...props }: { className?: string; [key: string]: string }) {
  return (
    <FontAwesomeIcon
      icon={faSpinner}
      spin
      className={className}
      {...props}
    />
  );
}
