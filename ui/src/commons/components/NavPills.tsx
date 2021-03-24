import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './NavPills.module.scss';

export interface NavLinkData {
  to: string;
  label: any;
  exact?: boolean;
  disabled?: boolean;
}

export function NavPills({ links, className }: {
  links: NavLinkData[];
  className?: string;
}) {
  return (
    <ul className={classNames(styles.pills, className)}>
      {links.map(navLinkData => {
        const isActive = () => {
          const url = navLinkData.to;
          const currentUrl = window.location.pathname;
          return navLinkData.exact ? url === currentUrl : currentUrl.indexOf(url) !== -1;
        };
        return (
          <li
            className={styles.pill}
            key={navLinkData.to}
          >
            {navLinkData.disabled ? (
              <div className={classNames(styles.link, styles.disabled)}>
                {navLinkData.label}
              </div>
            ) : (
              <NavLink
                to={navLinkData.to}
                isActive={isActive}
                exact={navLinkData.exact}
                activeClassName={styles.active}
                className={styles.link}
              >
                {navLinkData.label}
              </NavLink>
            )}
          </li>
        );
      })}
    </ul>
  );
}
