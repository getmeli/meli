import React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import classNames from 'classnames';
import styles from './Gauge.module.scss';

// https://github.com/kevinsqi/react-circular-progressbar/issues/31#issuecomment-338216925
function Gradient({
  startColor, endColor, idCSS, rotation, className,
}: {
  startColor: any;
  endColor: any;
  idCSS: any;
  rotation: any;
  className: any;
}) {
  const gradientTransform = `rotate(${rotation})`;
  return (
    <svg
      style={{
        height: 0,
      }}
      className={className}
    >
      <defs>
        <linearGradient id={idCSS} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Gauge({
  value, max, displayValue, className,
}: {
  value: number;
  max?: number;
  displayValue?: string | number;
  className?: string;
}) {
  const progress = value === null || value === undefined ? max : Math.round((value / max) * 100);

  return (
    <div className={classNames(styles.gauge, className)}>
      <Gradient startColor="#661AFF" endColor="#FF7F66" rotation="0" idCSS="svg-gauge-gradient" className="position-absolute" />
      <div className={styles.value}>
        {displayValue !== undefined ? displayValue : `${progress}%`}
      </div>
      <CircularProgressbar
        value={progress}
        text=""
        styles={buildStyles({
          pathTransitionDuration: 0.2,
          trailColor: '#EEECF9',
        })}
      />
    </div>
  );
}
