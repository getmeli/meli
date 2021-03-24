import moment from 'moment';
import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import { Tooltip, tooltipToggle } from './Tooltip';

export function FromNow({
  date, className, label = 'Created',
}: {
  label?: string;
  date: Date;
  className?;
}) {
  const [uid] = useState(uniqueId());
  return (
    <>
      <small
        {...tooltipToggle(uid)}
        className={className}
      >
        {label}
        {' '}
        {moment(date).fromNow()}
      </small>
      <Tooltip id={uid}>{date}</Tooltip>
    </>
  );
}
