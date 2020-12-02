export interface BuildInfo {
  version: string;
  buildDate: Date;
  commitHash: string;
}

declare global {
  const BUILD_INFO: BuildInfo;
  const SENTRY_RELEASE: string;
  const SENTRY_DSN: string;
}

declare module '*.hbs';
