import 'react-dates/initialize';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Router } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { App } from './App';
import { Toasts } from './commons/components/Toasts';
import './index.scss';
import { AuthProvider } from './providers/AuthProvider';
import { EnvProvider } from './providers/EnvProvider';
import { routerHistory } from './providers/history';
import { SocketProvider } from './websockets/SocketProvider';
import { isSentryEnabled, SENTRY_CONFIGURED, SentryProvider } from './commons/sentry/SentryProvider';
import { OrgProvider } from './providers/OrgProvider';

if (SENTRY_CONFIGURED) {
  if (isSentryEnabled()) {
    // eslint-disable-next-line no-console
    console.log('Sentry is enabled', process.env.REACT_APP_SENTRY_RELEASE, process.env.REACT_APP_SENTRY_DSN);
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      release: process.env.REACT_APP_SENTRY_RELEASE,
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('Sentry is disabled');
  }
}

class DebugRouter extends Router {
  constructor(props) {
    super(props);

    if (process.env.NODE_ENV !== 'production') {
      routerHistory.listen(location => {
        // eslint-disable-next-line no-console
        console.log(`URL=${location.pathname}${location.search}${location.hash}`, location);
      });
    }
  }
}

// eslint-disable-next-line no-console
console.log(
  `Meli UI ${
    process.env.REACT_APP_ENTERPRISE ? 'EE' : 'CE'
  } v${
    process.env.REACT_APP_VERSION
  } - ${
    process.env.REACT_APP_BUILD_DATE
  } - ${
    process.env.REACT_APP_COMMIT_HASH
  }`,
);

const root = document.getElementById('root');

Modal.setAppElement('#root');

const app = (
  <DebugRouter history={routerHistory}>
    <EnvProvider>
      <SocketProvider>
        <AuthProvider>
          <OrgProvider>
            <App />
          </OrgProvider>
        </AuthProvider>
      </SocketProvider>
    </EnvProvider>
  </DebugRouter>
);

ReactDOM.render(
  // <React.StrictMode>
  <>
    <div id="blur-overlay">
      {SENTRY_CONFIGURED ? (
        <SentryProvider>
          {app}
        </SentryProvider>
      ) : (
        app
      )}
    </div>
    <Toasts />
  </>,
  // </React.StrictMode>,
  root,
);
