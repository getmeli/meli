import React from 'react';
import classNames from 'classnames';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppLogo } from './AppLogo';
import styles from './Home.module.scss';

export function Home() {
  return (
    <div className={styles.container}>
      <AppLogo className={styles.logo} />
      <p className="mt-2">Deploy, now.</p>
      <div className={classNames(styles.inspire, 'mt-5')}>
        <p>
          We built
          {' '}
          <strong className="font-secondary">Meli</strong>
          {' '}
          because we believe that shipping frontend should not be hard. We truly hope you enjoy using it as much as we do.
        </p>
        <div className={styles.quoteContainer}>
          <FontAwesomeIcon icon={faQuoteLeft} className={styles.quoteIcon} />
          <p className={styles.quote}>
            Because the people who are crazy enough to think they can change the world, are the ones who do.
          </p>
          <p className={styles.author}>Steve Jobs</p>
        </div>
      </div>
    </div>
  );
}
