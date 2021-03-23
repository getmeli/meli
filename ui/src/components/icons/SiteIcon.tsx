import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export function SiteIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faRocket}
      className={className}
      fixedWidth
    />
  );
}
