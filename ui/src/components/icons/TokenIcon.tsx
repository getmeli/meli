import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export function TokenIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faKey}
      className={className}
      fixedWidth
    />
  );
}
