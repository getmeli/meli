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
        | Handlers.StaticResponse
        | Handlers.Subroute
        | Handlers.Templates
        | Handlers.Vars;

      namespace Handlers {
        interface Acme {
          '@id'?: string;
          handler: 'acme_server';
          ca?: string;
          host?: string;
          path_prefix?: string;
        }

        interface Authentication {
          '@id'?: string;
          handler: 'authentication';
          providers: {
            '@id'?: string;
            http_basic: Authentication.Provider;
          };
        }

        namespace Authentication {
          type Provider = Providers.HttpBasic;

          namespace Providers {
            interface HttpBasic {
              '@id'?: string;
              hash?: HttpBasic.HashAlgorithm;
              accounts?: HttpBasic.Account[];
              realm?: string;
              hash_cache?: any;
            }

            namespace HttpBasic {
              interface Account {
                '@id'?: string;
                username?: string;
                password?: string;
                salt?: string;
              }

              type HashAlgorithm = HashAlgorithms.Bcrypt | HashAlgorithms.Scrypt

              namespace HashAlgorithms {
                interface Bcrypt {
                  '@id'?: string;
                  algorithm: 'bcrypt';
                }

                interface Scrypt {
                  '@id'?: string;
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
          '@id'?: string;
          handler: 'encode';
          encoding?: Encode.Encoding;
          minimum_length?: number;
        }

        namespace Encode {
          type Encoding = Encode.Encodings.Gzip | Encode.Encodings.Zstd;

          namespace Encodings {
            interface Gzip {
              '@id'?: string;
              level?: number;
            }
            type Zstd = EMPTY_OBJECT;
          }
        }

        interface Error {
          '@id'?: string;
          handler: 'error';
          error?: string;
          status_code?: number | string;
        }

        interface FileServer {
          '@id'?: string;
          handler: 'file_server';
          root?: string;
          hide?: string[];
          index_names?: string[];
          browse?: {
            '@id'?: string;
            template_file?: string;
          };
          canonical_uris?: boolean;
          pass_thru?: boolean;
        }

        interface Headers {
          '@id'?: string;
          handler: 'headers';
          request?: Headers.Request;
          response?: Headers.Response;
        }

        namespace Headers {
          interface Request {
            '@id'?: string;
            add?: { [header: string]: string[] };
            set?: { [header: string]: string[] };
            delete?: string[];
            replace?: { [header: string]: Headers.Replacement[] };
          }

          interface Response {
            '@id'?: string;
            add?: { [header: string]: string[] };
            set?: { [header: string]: string[] };
            delete?: string[];
            replace?: { [header: string]: Headers.Replacement[] };
            require?: {
              '@id'?: string;
              status_code?: number[];
              headers?: { [header: string]: string[] };
            };
            deferred?: boolean;
          }

          interface Replacement {
            '@id'?: string;
            search?: string;
            search_regexp?: string;
            replace?: string;
          }
        }

        interface Push {
          '@id'?: string;
          handler: 'push';
          resources?: Push.Resource[];
          headers?: {
            '@id'?: string;
            add?: { [header: string]: string[] };
            set?: { [header: string]: string[] };
            delete?: string[];
            replace?: { [header: string]: Headers.Replacement[] };
          }
        }

        namespace Push {
          interface Resource {
            '@id'?: string;
            method?: 'GET' | 'HEAD';
            target?: string;
          }
        }

        interface RequestBody {
          '@id'?: string;
          handler: 'request_body';
          max_size?: number;
        }

        interface ReverseProxy {
          '@id'?: string;
          handler: 'reverse_proxy';
          transport?: ReverseProxy.Transport;
          circuit_breaker?: UNDOCUMENTED;
          load_balancing?: ReverseProxy.LoadBalancing;
          health_checks?: ReverseProxy.HealthChecks;
          upstreams?: ReverseProxy.Upstream[];
          flush_interval?: Duration;
          headers?: {
            '@id'?: string;
            request?: Headers.Request;
            response?: Headers.Response;
          };
          buffer_requests?: boolean;
          handle_response?: ReverseProxy.HandleResponse;
        }

        namespace ReverseProxy {
          interface Transport {
            '@id'?: string;
            fastcgi?: Transports.Fastcgi;
            http?: Transports.Http;
          }

          namespace Transports {
            interface Fastcgi {
              '@id'?: string;
              protocol: 'fastcgi';
              root?: string;
              split_path?: string[];
              env?: { [variable: string]: string };
              dial_timeout?: Duration;
              read_timeout?: Duration;
              write_timeout?: Duration;
            }

            interface Http {
              '@id'?: string;
              protocol: 'http';
              resolver?: {
                '@id'?: string;
                addresses: string[];
              };
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
                '@id'?: string;
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
                '@id'?: string;
                enabled?: boolean;
                probe_interval?: Duration;
                max_idle_conns?: number;
                max_idle_conns_per_host?: number;
                idle_timeout?: Duration;
              }
            }
          }

          interface LoadBalancing {
            '@id'?: string;
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
                '@id'?: string;
                policy: 'first';
              }
              interface Header {
                '@id'?: string;
                policy: 'header';
                field?: string;
              }
              interface IpHash {
                '@id'?: string;
                policy: 'ip_hash';
              }
              interface LeastConn {
                '@id'?: string;
                policy: 'least_conn';
              }
              interface Random {
                '@id'?: string;
                policy: 'random';
              }
              interface RandomChoose {
                '@id'?: string;
                policy: 'random_choose';
                choose?: number;
              }
              interface RoundRobin {
                '@id'?: string;
                policy: 'round_robin';
              }
              interface UriHash {
                '@id'?: string;
                policy: 'uri_hash';
              }
            }
          }

          interface HealthChecks {
            '@id'?: string;
            active?: {
              '@id'?: string;
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
              '@id'?: string;
              fail_duration?: Duration;
              max_fails?: number;
              unhealthy_request_count?: number;
              unhealthy_status?: number[];
              unhealthy_latency?: number;
            };
          }

          interface Upstream {
            '@id'?: string;
            dial?: string;
            lookup_srv?: string;
            max_requests?: number;
          }

          interface HandleResponse {
            '@id'?: string;
            match: {
              '@id'?: string;
              status_code?: number[];
              headers?: { [header: string]: string };
            };
            status_code?: string;
            routes?: Route[];
          }
        }

        interface Rewrite {
          '@id'?: string;
          handler: 'rewrite';
          method?: string;
          url?: string;
          strip_path_prefix?: string;
          strip_path_suffix?: string;
          uri_substring?: {
            '@id'?: string;
            find?: string;
            replace?: string;
            limit?: number;
          }[];
        }

        interface StaticResponse {
          '@id'?: string;
          handler: 'static_response';
          status_code?: number | string;
          headers?: { [name: string]: string };
          body?: string;
          close?: boolean;
        }

        interface Subroute {
          '@id'?: string;
          handler: 'subroute';
          routes?: Route[];
          errors?: {
            '@id'?: string;
            routes?: Route[];
          };
        }

        interface Templates {
          '@id'?: string;
          handler: 'templates';
          file_root?: string;
          mime_types?: string[];
          delimiters?: string[];
        }

        interface Vars {
          '@id'?: string;
          handler: 'vars';
          [name: string]: string;
        }
      }

    }
  }
}
