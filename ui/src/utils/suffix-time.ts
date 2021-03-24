import { round } from 'lodash';

interface SuffixTime {
  value: number;
  suffix: string;
}

export function suffixTime(ms: number, precision = 1): SuffixTime {
  if (ms >= 3600000) {
    return {
      value: round(ms / 3600000, precision), suffix: 'h',
    };
  }
  if (ms >= 60000) {
    return {
      value: round(ms / 60000, precision), suffix: 'min',
    };
  }
  if (ms >= 1000) {
    return {
      value: round(ms / 1000, precision), suffix: 's',
    };
  }
  return {
    value: round(ms, precision), suffix: 'ms',
  };
}
