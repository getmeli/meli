import { URL } from 'url';

export function isUrl(value: string) {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
  } catch (e) {
    throw new Error('value is not a valid URL');
  }
  return value;
}
