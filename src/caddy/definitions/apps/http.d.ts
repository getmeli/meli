declare namespace Caddy {
  interface Http {
    http_port?: number;
    https_port?: number;
    grace_period?: Duration;
    servers?: { [name: string]: Http.Server };
  }

  namespace Http {
    interface Server {
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
        logger_names?: { [hostname: string]: string };
        skip_hosts?: string[];
        skip_unmapped_hosts?: string;
      };
      experimental_http3?: boolean;
      allow_h2c?: boolean;
    }
  }


}
