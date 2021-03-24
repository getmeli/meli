import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export function RedirectIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faDirections}
      className={className}
      fixedWidth
    />
  );
}
