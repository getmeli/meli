export enum RedirectType {
  file = 'file',
  reverse_proxy = 'reverse_proxy',
}

export interface FileRedirectConfig {
  content: string;
}

export interface ReverseProxyRedirectConfig {
  url: string;
  stripPathPrefix: string;
}

export interface BranchRedirect<T = any> {
  _id: string;
  type: RedirectType;
  // https://caddyserver.com/docs/json/apps/http/servers/routes/match/path/
  path: string;
  config: T;
  url: string;
}
