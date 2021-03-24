import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faVihara } from '@fortawesome/free-solid-svg-icons';

export function OrgIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faVihara}
      className={className}
      fixedWidth
    />
  );
}
