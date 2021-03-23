import React from 'react';
import ReactTooltip from 'react-tooltip';
import styles from './DropDown.module.scss';

const minLeft = 20;
const minRight = 20;

export function dropdownToggle(id: string) {
  return {
    'data-event': 'click',
    'data-for': id,
    'data-tip': 'tip',
  };
}

export function Dropdown({
  children, id, className, ...props
}: { children: any; id: string; className?: string; [key: string]: any }) {
  return (
    <>
      <ReactTooltip
        id={id}
        place="bottom"
        effect="solid"
        className={`${styles.dropdown}${className ? ` ${className}` : ''}`}
        globalEventOff="click"
        eventOff="close-dropdown"
        clickable
        overridePosition={({ left, top }, event, triggerElement, tooltipElement) => {
          let newLeft = left;
          if (left <= minLeft) {
            newLeft = minLeft;
          } else if (window.innerWidth - tooltipElement.offsetWidth < minRight) {
            newLeft = window.innerWidth - tooltipElement.offsetWidth - minRight;
          }
          return {
            top,
            left: newLeft,
          };
        }}
        {...props}
      >
        {children}
      </ReactTooltip>
    </>
  );
}
