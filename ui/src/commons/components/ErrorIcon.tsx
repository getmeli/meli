import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { uniqueId } from 'lodash';
import { Tooltip, tooltipToggle } from './Tooltip';

export function ErrorIcon({ error, className }: {
  error: any;
  className?: string;
}) {
  const [id] = useState(uniqueId());
  return (
    <>
      <FontAwesomeIcon
        icon={faExclamationCircle}
        {...tooltipToggle(id)}
        className={className}
      />
      <Tooltip id={id}>
        {error.toString()}
      </Tooltip>
    </>
  );
}
