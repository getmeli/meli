import { URL } from 'url';

export function toUrl(str: string): URL {
  return new URL(str);
}
