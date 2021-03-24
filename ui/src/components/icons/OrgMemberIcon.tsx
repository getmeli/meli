import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export function OrgMemberIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faUserAstronaut}
      className={className}
      fixedWidth
    />
  );
}
