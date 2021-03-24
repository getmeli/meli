import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './ProgressBar.module.scss';

export function ProgressBar({
  value, max, className,
}: { value: number; max: number; className?: any }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const p = max === null || max === undefined || Number.isNaN(max)
      ? 100
      : Math.round((value / max) * 100);
    setProgress(p);
  }, [value, max]);

  const width = `${progress}%`;

  return (
    <div className={classNames(className, styles.progress)}>
      <div
        className={classNames(styles.bar, 'progress-bar')}
        style={{
          width,
        }}
      >
        <div
          className={styles.gradient}
          style={{
            width: `${(100 / progress) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
