import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export function ReleaseIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faList}
      className={className}
      fixedWidth
    />
  );
}
