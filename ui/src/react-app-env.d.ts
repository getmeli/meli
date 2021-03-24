/// <reference types="react-scripts" />

declare const process: Process;

declare interface Process {
  env: {
    NODE_ENV: string;
    REACT_APP_ENTERPRISE: boolean;
    // build info
    REACT_APP_VERSION: string;
    REACT_APP_BUILD_DATE: string;
    REACT_APP_COMMIT_HASH: string;
    // sentry
    REACT_APP_SENTRY_RELEASE: string;
    REACT_APP_SENTRY_DSN: string;
  };
}

declare module '*.md';
