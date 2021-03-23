import React, { createContext, useContext, useState } from 'react';
import classNames from 'classnames';
import styles from './SentryProvider.module.scss';
import { CardModal } from '../components/modals/CardModal';
import { ExternalLink } from '../components/ExternalLink';

const sentryLocalStorageKey = 'sentry.enabled';

export const SENTRY_CONFIGURED = !!process.env.REACT_APP_SENTRY_RELEASE && !!process.env.REACT_APP_SENTRY_DSN;

export function isSentryEnabled(): boolean {
  return localStorage.getItem(sentryLocalStorageKey) === 'true';
}

interface SentryContextType {
  enabled: boolean;
  openModal: () => void;
}

const SentryContext = createContext<SentryContextType>({
  enabled: isSentryEnabled(),
  openModal: undefined,
});

export const useSentry = () => useContext(SentryContext);

export function SentryProvider(props) {
  const [isOpen, setIsOpen] = useState(!localStorage.getItem(sentryLocalStorageKey));
  const [enabled] = useState<boolean>(isSentryEnabled());

  const openModal = () => {
    setIsOpen(true);
  };

  const enable = () => {
    localStorage.setItem(sentryLocalStorageKey, 'true');
    window.location.reload();
  };

  const disable = () => {
    localStorage.setItem(sentryLocalStorageKey, 'false');
    window.location.reload();
  };

  return !isOpen ? (
    <SentryContext.Provider
      {...props}
      value={{
        enabled,
        openModal,
      }}
    />
  ) : (
    <CardModal isOpen={isOpen} className={styles.modal} closeModal={disable} title="Enable Sentry">
      <p className="text-center">
        <ExternalLink href="https://sentry.io/">Sentry</ExternalLink>
        {' '}
        helps us get crash reports remotely. Enabling it allows us to make this platform better.
      </p>
      <div className={classNames('mt-4 d-flex justify-content-end', styles.buttons)}>
        <button type="button" onClick={disable} className="btn btn-outline-primary">
          Disable
        </button>
        <button type="button" onClick={enable} className="btn btn-success">
          Enable
        </button>
      </div>
    </CardModal>
  );
}
