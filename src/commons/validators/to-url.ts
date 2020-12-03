import { URL } from 'url';

export function toUrl(str: string): URL {
  return str ? new URL(str) : undefined;
}
