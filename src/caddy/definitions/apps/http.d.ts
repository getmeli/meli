declare namespace Caddy {
  interface Http {
    '@id'?: string;
    http_port?: number;
    https_port?: number;
    grace_period?: Duration;
    servers?: { [name: string]: Http.Server };
  }

  namespace Http {
    interface Server {
      '@id'?: string;
      listen?: string[];
      listener_wrappers?: ListenerWrappers[];
      read_timeout?: Duration;
      read_header_timeout?: Duration;
      write_timeout?: Duration;
      idle_timeout?: Duration;
      max_header_bytes?: number;
      routes?: Route[];
      errors?: {
        '@id'?: string;
        routes: Route[];
      };
      tls_connection_policies?: HttpServerTlsConnectionPolicy[];
      automatic_https?: {
        '@id'?: string;
        disable?: boolean;
        disable_redirects?: boolean;
        skip?: string[];
        skip_certificates?: string[];
        ignore_loaded_certificates?: boolean;
      };
      strict_sni_host?: boolean;
      logs?: {
        '@id'?: string;
        default_logger_name?: string;
        logger_names?: { [hostname: string]: string };
        skip_hosts?: string[];
        skip_unmapped_hosts?: string;
      };
      experimental_http3?: boolean;
      allow_h2c?: boolean;
    }
  }

  type ListenerWrappers = ListenerWrappers.Tls;

  namespace ListenerWrappers {
    interface Tls {
      '@id'?: string;
      wrapper: 'tls';
    }
  }

  interface HttpServerTlsConnectionPolicy {
    '@id'?: string;
    match?: TlsHandshakeMatch;
    certificate_selection?: CertificateSelection;
    cipher_suite?: string[];
    curves?: string[];
    alpn?: string[];
    protocol_min?: string;
    protocol_max?: string;
    client_authentication?: ClientAuthentication;
    default_sni?: string;
  }

  interface TlsHandshakeMatch {
    '@id'?: string;
    sni?: string[];
  }

  interface CertificateSelection {
    serial_number?: string[];
    subject_organization?: string[];
    public_key_algorithm?: number;
    any_tag?: string[];
    all_tags?: string[];
  }

  interface ClientAuthentication {
    trusted_ca_certs?: string[];
    trusted_ca_certs_pem_files?: string[];
    trusted_leaf_certs?: string[];
    mode?: string;
  }

}
