declare namespace Caddy {
  namespace Http {
    namespace Route {

      type Handler = Handlers.Acme
        | Handlers.Authentication
        | Handlers.Encode
        | Handlers.Error
        | Handlers.FileServer
        | Handlers.Headers
        | Handlers.Push
        | Handlers.RequestBody
        | Handlers.ReverseProxy
        | Handlers.Rewrite
        | Handlers.Subroute
        | Handlers.Templates;

      namespace Handlers {
        interface Acme {
          handler: 'acme_server';
          ca?: string;
          host?: string;
          path_prefix?: string;
        }

        interface Authentication {
          handler: 'authentication';
          providers: {
            http_basic: Authentication.Provider;
          };
        }

        namespace Authentication {
          type Provider = Providers.HttpBasic;

          namespace Providers {
            interface HttpBasic {
              hash?: HttpBasic.HashAlgorithm;
              accounts?: HttpBasic.Account[];
              realm?: string;
              hash_cache?: any;
            }

            namespace HttpBasic {
              interface Account {
                username?: string;
                password?: string;
                salt?: string;
              }

              type HashAlgorithm = HashAlgorithms.Bcrypt | HashAlgorithms.Scrypt

              namespace HashAlgorithms {
                interface Bcrypt {
                  algorithm: 'bcrypt';
                }

                interface Scrypt {
                  algorithm: 'scrypt';
                  N?: number;
                  r?: number;
                  p?: number;
                  key_length?: number;
                }
              }
            }
          }
        }

        interface Encode {
          handler: 'encode';
          encoding?: Encode.Encoding;
          minimum_length?: number;
        }

        namespace Encode {
          type Encoding = Encode.Encodings.Gzip | Encode.Encodings.Zstd;

          namespace Encodings {
            interface Gzip {
              level?: number;
            }
            type Zstd = EMPTY_OBJECT;
          }
        }

        interface Error {
          handler: 'error';
          error?: string;
          status_code?: number | string;
        }

        interface FileServer {
          handler: 'file_server';
          root?: string;
          hide?: string[];
          index_names?: string[];
          browse?: {
            template_file?: string;
          };
          canonical_uris?: boolean;
          pass_thru?: boolean;
        }

        interface Headers {
          handler: 'headers';
          request?: Headers.Request;
          response?: Headers.Response;
        }

        namespace Headers {
          interface Request {
            add?: { [header: string]: string[] };
            set?: { [header: string]: string[] };
            delete?: string[];
            replace?: { [header: string]: Headers.Replacement[] };
          }

          interface Response {
            add?: { [header: string]: string[] };
            set?: { [header: string]: string[] };
            delete?: string[];
            replace?: { [header: string]: Headers.Replacement[] };
            require?: {
              status_code?: number[];
              headers?: { [header: string]: string[] };
            };
            deferred?: boolean;
          }

          interface Replacement {
            search?: string;
            search_regexp?: string;
            replace?: string;
          }
        }

        interface Push {
          handler: 'push';
          resources?: Push.Resource[];
          headers?: {
            add?: { [header: string]: string[] };
            set?: { [header: string]: string[] };
            delete?: string[];
            replace?: { [header: string]: Headers.Replacement[] };
          }
        }

        namespace Push {
          interface Resource {
            method?: 'GET' | 'HEAD';
            target?: string;
          }
        }

        interface RequestBody {
          handler: 'request_body';
          max_size?: number;
        }

        interface ReverseProxy {
          handler: 'reverse_proxy';
          transport?: ReverseProxy.Transport;
          circuit_breaker?: UNDOCUMENTED;
          load_balancing?: ReverseProxy.LoadBalancing;
          health_checks?: ReverseProxy.HealthChecks;
          upstreams?: ReverseProxy.Upstream[];
          flush_interval?: Duration;
          headers?: {
            request?: Headers.Request;
            response?: Headers.Response;
          };
          buffer_requests?: boolean;
          handle_response?: ReverseProxy.HandleResponse;
        }


        namespace ReverseProxy {
          interface Transport {
            fastcgi?: Transports.Fastcgi;
            http?: Transports.Http;
          }

          namespace Transports {
            interface Fastcgi {
              protocol: 'fastcgi';
              root?: string;
              split_path?: string[];
              env?: { [variable: string]: string };
              dial_timeout?: Duration;
              read_timeout?: Duration;
              write_timeout?: Duration;
            }

            interface Http {
              protocol: 'http';
              resolver?: { addresses: string[] };
              tls?: HttpTransport.Tls;
              keep_alive?: HttpTransport.KeepAlive;
              compression?: boolean;
              max_conns_per_host?: number;
              dial_timeout?: Duration;
              dial_fallback_delay?: Duration;
              response_header_timeout?: Duration;
              expect_continue_timeout?: Duration;
              max_response_header_size?: number;
              write_buffer_size?: number;
              read_buffer_size?: number;
              versions?: string[];
            }

            namespace HttpTransport {
              interface Tls {
                root_ca_pool?: string[];
                root_ca_pem_files?: string[];
                client_certificate_file?: string[];
                client_certificate_key_file?: string[];
                client_certificate_automate?: string[];
                insecure_skip_verify?: boolean;
                handshake_timeout?: Duration;
                server_name?: string;
              }

              interface KeepAlive {
                enabled?: boolean;
                probe_interval?: Duration;
                max_idle_conns?: number;
                max_idle_conns_per_host?: number;
                idle_timeout?: Duration;
              }
            }
          }

          interface LoadBalancing {
            selection_policy?: LoadBalancing.SelectionPolicy;
            try_duration?: Duration;
            try_interval?: Duration;
            retry_match?: Route.Matcher[];
          }

          namespace LoadBalancing {
            type SelectionPolicy = SelectionPolicies.First
              | SelectionPolicies.Header
              | SelectionPolicies.IpHash
              | SelectionPolicies.LeastConn
              | SelectionPolicies.Random
              | SelectionPolicies.RandomChoose
              | SelectionPolicies.RoundRobin
              | SelectionPolicies.UriHash;

            namespace SelectionPolicies {
              interface First {
                policy: 'first';
              }
              interface Header {
                policy: 'header';
                field?: string;
              }
              interface IpHash {
                policy: 'ip_hash';
              }
              interface LeastConn {
                policy: 'least_conn';
              }
              interface Random {
                policy: 'random';
              }
              interface RandomChoose {
                policy: 'random_choose';
                choose?: number;
              }
              interface RoundRobin {
                policy: 'round_robin';
              }
              interface UriHash {
                policy: 'uri_hash';
              }
            }
          }

          interface HealthChecks {
            active?: {
              path?: string;
              port?: number;
              headers?: { [header: string]: string };
              interval?: Duration;
              timeout?: Duration;
              max_size?: number;
              expect_status?: number;
              expect_body?: string;
            };
            passive?: {
              fail_duration?: Duration;
              max_fails?: number;
              unhealthy_request_count?: number;
              unhealthy_status?: number[];
              unhealthy_latency?: number;
            };
          }

          interface Upstream {
            dial?: string;
            lookup_srv?: string;
            max_requests?: number;
          }

          interface HandleResponse {
            match: {
              status_code?: number[];
              headers?: { [header: string]: string };
            };
            status_code?: string;
            routes?: Route[];
          }
        }

        interface Rewrite {
          handler: 'rewrite';
          method?: string;
          url?: string;
          strip_path_prefix?: string;
          strip_path_suffix?: string;
          uri_substring?: {
            find?: string;
            replace?: string;
            limit?: number;
          }[];
        }

        interface Subroute {
          handler: 'subroute';
          routes?: Route[];
          errors?: { routes?: Route[] };
        }

        interface Templates {
          handler: 'templates';
          file_root?: string;
          mime_types?: string[];
          delimiters?: string[];
        }
      }

    }
  }
}
