import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export function SecurityIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faLock}
      className={className}
      fixedWidth
    />
  );
}
