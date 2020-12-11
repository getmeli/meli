
declare namespace Caddy {

  type TODO = unknown;
  type NON_STANDARD = any;

  type Duration = number | string;

  interface Root {
    admin?: Admin;
    logging?: Logging;
    storage?: Storage;
    apps?: Apps;
  }

  interface Admin {
    disabled?: boolean;
    listen?: string;
    enforce_origin?: boolean;
    origins?: string[];
    config?: {
      persist?: boolean;
    };
  }

  interface Apps {
    http?: Http;
    pki?: Pki;
    tls?: Tls;
  }

  interface Logging {
    // TODO
  }

  interface Storage {
    // TODO
  }

  interface Http {
    http_port?: number;
    https_port?: number;
    grace_period?: Duration;
    servers?: {[name: string]: HttpServer}
    // TODO
  }

  interface HttpServer {
    listen?: string[];
    listener_wrappers?: TODO[];
    read_timeout?: Duration;
    read_header_timeout?: Duration;
    write_timeout?: Duration;
    idle_timeout?: Duration;
    max_header_bytes?: number;
    routes?: HttpRoute[];
    errors?: HttpRoute[];
    tls_connection_policies?: HttpServerTlsConnectionPolicy[];
    automatic_https?: {
      disable?: boolean;
      disable_redirects?: boolean;
      skip?: string[];
      skip_certificates?: string[];
      ignore_loaded_certificates?: boolean;
    };
    strict_sni_host?: boolean;
    logs?: {
      default_logger_name?: string;
      logger_names?: {[hostname: string]: string};
      skip_hosts?: string[];
      skip_unmapped_hosts?: string;
    };
    experimental_http3?: boolean;
    allow_h2c?: boolean;
  }

  interface HttpRoute {
    group?: string;
    match?: HttpRouteMatcher[];
    handle?: HttpRouteHandler[];
    terminal?: boolean;
  }

  interface HttpRouteMatcher {
    execnopmatch?: NON_STANDARD;
    expression?: string; // TODO check
    file?: {
      root?: string;
      try_files?: string[];
      try_policy?: 'first_exist' | 'smallest_size' | 'largest_size' | 'most_recently_modified';
      split_path?: string[];
    };
    header?: {[header: string]: string[]};
    header_regexp?: {
      [header: string]: MatchRegexp;
    };
    host?: string[];
    maxmind_geolocation?: NON_STANDARD;
    method?: string[];
    not?: HttpRouteMatcher[];
    path?: string[];
    path_regexp?: MatchRegexp;
    protocol?: string;
    query?: {[param: string]: string[]};
    remote_ip?: {
      ranges?: string[];
    };
    vars?: {[variable: string]: string};
    vars_regexp?: {[variable: string]: MatchRegexp};
  }

  interface MatchRegexp {
    name?: string;
    pattern?: string;
  }



  interface HttpServerTlsConnectionPolicy {
    match?: TlsHandshakeMatch;
  }

  interface TlsHandshakeMatch {
    sni?: string;
  }

  interface Pki {
    // TODO
  }

  interface Tls {
    certificates?: TlsCertificates;
    automation?: {
      policies?: TlsAutomationPolicy[];
      on_demand?: TlsAutomationOnDemand;
      ocsp_interval?: Duration;
      renew_interval?: Duration;
    };
    session_tickets?: TODO;
    cache?: {
      capacity?: number;
    };
  }

  interface TlsCertificates {
    automate?: string[];
    load_files?: TlsCertificatesLoadFilesEntry[];
    load_folders?: string[];
    load_pem?: TlsCertificatesLoadPemEntry[];
  }

  interface TlsCertificatesLoadFilesEntry {
    certificate?: string;
    key?: string;
    format?: 'pem' | string;
    tags?: string[];
  }

  interface TlsCertificatesLoadPemEntry {
    certificate?: string;
    key?: string;
    tags?: string[];
  }

  interface TlsAutomationPolicy {
    subjects?: string[];
    issuer?: TlsAutomationPolicyIssuer;
    must_staple?: number;
    renewal_window_ratio?: number;
    key_type: string;
    storage?: TODO;
    on_demand?: boolean;
  }

  type TlsAutomationPolicyIssuer = TlsAutomationPolicyAcmeIssuer
    | TlsAutomationPolicyInternalIssuer
    | TlsAutomationPolicyZerosslIssuer;

  interface TlsAutomationPolicyAcmeIssuer {
    module: 'acme';
    ca?: string;
    test_ca?: string;
    email?: string;
    external_account?: {
      key_id?: string;
      hmac?: string;
    };
    acme_timeout?: Duration;
    challenges?: {
      http?: {
        disabled?: boolean;
        alternate_port?: number;
      };
      'tls-alpn'?: {
        disabled?: boolean;
        alternate_port?: number;
      };
      dns?: {
        provider?: NON_STANDARD;
        ttl?: number | string;
      };
      bind_host?: string;
    }
  }

  interface TlsAutomationPolicyInternalIssuer {
    module?: 'internal';
    ca?: string;
    lifetime?: Duration;
    sign_with_root?: boolean;
  }

  interface TlsAutomationPolicyZerosslIssuer {
    module: 'zerossl';
    // TODO
  }

  interface TlsAutomationOnDemand {
    rate_limit?: {
      interval?: Duration;
      burst?: number;
    };
    ask?: string;
  }
}
