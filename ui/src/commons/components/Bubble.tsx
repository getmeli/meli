import React from 'react';
import classNames from 'classnames';
import styles from './Bubble.module.scss';

export function Bubble({ color, className, src }: {
  color?: string;
  src?: string;
  className?: any;
}) {
  return src ? (
    <img
      alt="bubble"
      src={src}
      className={classNames(styles.bubble, className)}
    />
  ) : (
    <div
      style={{
        background: color,
      }}
      className={classNames(styles.bubble, className)}
    />
  );
}
