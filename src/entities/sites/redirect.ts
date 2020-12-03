import { object, string } from 'joi';
import { enumToArray } from '../../commons/enum-to-array';
import { LONG_STRING_MAX_LENGTH, STRING_MAX_LENGTH } from '../../constants';
import { isUrl } from '../../commons/validators/is-url';

export enum RedirectType {
  file = 'file',
  reverse_proxy = 'reverse_proxy',
}

export interface FileRedirectConfig {
  content: string;
}

const $fileRedirect = object({
  content: string().optional().max(LONG_STRING_MAX_LENGTH),
}).required();

export interface ReverseProxyRedirectConfig {
  url: string;
  stripPathPrefix: string;
}

const $reverseProxyRedirect = object({
  url: string().required().custom(isUrl).max(STRING_MAX_LENGTH),
  stripPathPrefix: string().optional().empty('').max(STRING_MAX_LENGTH),
}).required();

export interface Redirect<T = any> {
  _id: string;
  type: RedirectType;
  // https://caddyserver.com/docs/json/apps/http/servers/routes/match/path/
  path: string;
  config: T;
}

export const $redirect = object({
  type: string().required().valid(...enumToArray(RedirectType)),
  path: string().required().trim().regex(/^\//),
  config: object()
    .when('type', {
      is: RedirectType.file,
      then: $fileRedirect,
    })
    .when('type', {
      is: RedirectType.reverse_proxy,
      then: $reverseProxyRedirect,
    }),
});

export function formatRedirectPath(path: string) {
  return encodeURI(path.replace(/^\//, ''));
}
