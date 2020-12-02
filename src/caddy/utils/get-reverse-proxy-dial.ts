import { URL } from 'url';

export function getReverseProxyDial(host: string) {
  const url = new URL(host);
  let { port } = url;
  if (port === '') {
    port = url.protocol === 'https:' ? '443' : '80';
  }
  return `${url.hostname}:${port}`;
}
