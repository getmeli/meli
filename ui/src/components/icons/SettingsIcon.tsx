import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export function SettingsIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faWrench}
      className={className}
      fixedWidth
    />
  );
}
