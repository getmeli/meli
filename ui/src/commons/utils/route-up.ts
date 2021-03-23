export function routeUp(url: string) {
  return url.split('/').slice(0, -1).join('/');
}
