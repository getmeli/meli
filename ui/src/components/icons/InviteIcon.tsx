import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import React from 'react';

export function InviteIcon({ className }: { className? }) {
  return (
    <FontAwesomeIcon
      icon={faPaperPlane}
      className={className}
      fixedWidth
    />
  );
}
