import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import { SentryIcon } from '../commons/sentry/SentryIcon';
import { ExternalLink } from '../commons/components/ExternalLink';
import { BuildInfo } from './BuildInfo';

export function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div>
          <ExternalLink
            href="https://twitter.com/getmeli"
            className={styles.link}
          >
            Twitter
          </ExternalLink>
          <Link
            to="/legal"
            className={styles.link}
          >
            Legal
          </Link>
        </div>
        <div className="text-muted d-flex align-items-center">
          <SentryIcon />
          <BuildInfo className="ml-2" />
        </div>
      </footer>
    </>
  );
}
