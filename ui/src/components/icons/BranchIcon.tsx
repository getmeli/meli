import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';

export function BranchIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faCodeBranch}
      className={className}
      fixedWidth
    />
  );
}
