import { round } from 'lodash';

export interface SuffixBigNumber {
  value: number;
  suffix: string;
}

export function suffixBigNumber(value: number, precision = 1): SuffixBigNumber {
  if (value >= 1000000000) {
    return {
      value: round(value / 1000000000, precision), suffix: 'B',
    };
  }
  if (value >= 1000000) {
    return {
      value: round(value / 1000000, precision), suffix: 'M',
    };
  }
  if (value >= 1000) {
    return {
      value: round(value / 1000, precision), suffix: 'k',
    };
  }
  return {
    value: round(value, precision), suffix: '',
  };
}
