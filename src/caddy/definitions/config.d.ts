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

}
