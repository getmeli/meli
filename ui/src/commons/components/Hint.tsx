import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { uniqueId } from 'lodash';
import classNames from 'classnames';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Tooltip, tooltipToggle } from './Tooltip';
import styles from './Hint.module.scss';

export function Hint({
  children, className, onClick,
}: {
  children: any;
  className?: string;
  onClick?: () => void;
}) {
  const [id] = useState(uniqueId());
  return (
    <>
      <div
        className={classNames(styles.hint, className)}
        {...tooltipToggle(id)}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faQuestion} />
      </div>
      <Tooltip id={id}>
        {children}
      </Tooltip>
    </>
  );
}
