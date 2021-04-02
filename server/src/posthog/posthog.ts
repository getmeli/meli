import PostHog from 'posthog-node';
import { env } from '../env/env';

export const postHog = new PostHog(
  '-BcCDFlG6nIchkTWROH5C3iplPWRjdEwrb6wpQKKwDg',
  {
    host: 'https://posthog.meli.sh',
    enable: env.MELI_POSTHOG_ENABLED,
  },
);

export const postHogId = {
  id: undefined,
};
