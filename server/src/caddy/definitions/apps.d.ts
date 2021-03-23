declare namespace Caddy {
  interface Apps {
    '@id'?: string;
    http?: Http;
    pki?: Pki;
    tls?: Tls;
  }
}
