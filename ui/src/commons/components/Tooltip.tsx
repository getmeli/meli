import ReactTooltip from 'react-tooltip';
import React from 'react';
import styles from './Tooltip.module.scss';

export function Tooltip({
  children, id, ...props
}: { children: any; id: string; [key: string]: any }) {
  return (
    <>
      <ReactTooltip effect="solid" id={id} className={styles.tooltip} {...props}>
        {children}
      </ReactTooltip>
    </>
  );
}

export function tooltipToggle(id: string) {
  return {
    'data-tip': 'tip',
    'data-for': id,
  };
}
