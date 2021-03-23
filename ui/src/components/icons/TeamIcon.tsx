import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export function TeamIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faSpaceShuttle}
      className={className}
      fixedWidth
    />
  );
}
