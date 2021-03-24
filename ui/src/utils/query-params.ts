import qs from 'qs';

export function queryParams(): { [key: string]: string } {
  return qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  }) as any;
}
