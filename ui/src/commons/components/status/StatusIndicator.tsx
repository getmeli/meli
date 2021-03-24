import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import classNames from 'classnames';
import { uniqueId } from 'lodash';
import styles from './StatusIndicator.module.scss';
import { getStatusIcon } from './get-status-icon';
import { Tooltip, tooltipToggle } from '../Tooltip';

export function StatusIndicator({ status, className }: {
  status: string;
  className?: string;
}) {
  const [uid] = useState(uniqueId());
  const { icon, spin } = getStatusIcon(status);
  return (
    <>
      <div
        className={classNames(styles.status, styles[`status-${status}`], className)}
        {...tooltipToggle(uid)}
      >
        {icon && (
          <FontAwesomeIcon icon={icon} spin={spin} />
        )}
      </div>
      <Tooltip id={uid}>
        {status}
      </Tooltip>
    </>
  );
}
