import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import React from 'react';

export function HookIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faBell}
      className={className}
      fixedWidth
    />
  );
}
