import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export function FormIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faCode}
      className={className}
      fixedWidth
    />
  );
}
