import React from 'react';
import styles from './EmptyList.module.scss';

export function EmptyList({
  title, icon, subTitle, children,
}: {
  title: string;
  subTitle?: string;
  icon: any;
  children?: any;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <h2 className={styles.title}>{title}</h2>
      {subTitle && <div className={styles.subtitle}>{subTitle}</div>}
      {children || <></>}
    </div>
  );
}
