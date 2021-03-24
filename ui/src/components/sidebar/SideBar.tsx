import React from 'react';
import classNames from 'classnames';
import styles from './SideBar.module.scss';
import { Teams } from './Teams';

export function SideBar({ className }: { className? }) {
  return (
    <nav className={classNames(styles.container, className)}>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Teams />
          </div>
        </div>
      </div>
    </nav>
  );
}
