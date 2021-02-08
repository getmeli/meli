declare namespace Caddy {

  type TODO = unknown;
  type NON_STANDARD = any;
  type EMPTY_OBJECT = { [key: string]: never };
  type UNDOCUMENTED = any;

  type Duration = number | string;

  interface Root {
    '@id'?: string;
    admin?: Admin;
    logging?: Logging;
    storage?: Storage;
    apps?: Apps;
  }

  interface HttpServerTlsConnectionPolicy {
    '@id'?: string;
    match?: TlsHandshakeMatch;
  }

  interface TlsHandshakeMatch {
    '@id'?: string;
    sni?: string[];
  }

}
