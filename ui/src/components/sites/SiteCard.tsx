import React from 'react';
import classNames from 'classnames';
import styles from './SiteCard.module.scss';
import { Site } from './site';
import { Bubble } from '../../commons/components/Bubble';

export function SiteCard({ site, className }: {
  site: Site;
  className?;
}) {
  return (
    <div className={classNames(styles.container, className, 'list-group-item list-group-item-action')}>
      <div className="d-flex align-items-center">
        <Bubble color={site.color} src={site.logo} />
        <span className="ml-2">{site.name}</span>
      </div>
    </div>
  );
}
