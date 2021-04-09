declare namespace Caddy {
  interface Tls {
    '@id'?: string;
    certificates?: Tls.Certificates;
    automation?: Tls.Automation;
    session_tickets?: Tls.SessionTickets;
    cache?: {
      '@id'?: string;
      capacity?: number;
    };
  }

  namespace Tls {
    interface Certificates {
      '@id'?: string;
      automate?: string[];
      load_files?: Certificates.LoadFilesEntry[];
      load_folders?: string[];
      load_pem?: Certificates.LoadPemEntry[];
    }

    namespace Certificates {
      interface LoadFilesEntry {
        '@id'?: string;
        certificate?: string;
        key?: string;
        format?: 'pem' | string;
        tags?: string[];
      }

      interface LoadPemEntry {
        '@id'?: string;
        certificate?: string;
        key?: string;
        tags?: string[];
      }
    }

    interface Automation {
      '@id'?: string;
      policies?: Automation.Policy[];
      on_demand?: Automation.OnDemand;
      ocsp_interval?: Duration;
      renew_interval?: Duration;
    }

    namespace Automation {
      interface Policy {
        '@id'?: string;
        subjects?: string[];
        /**
         * @deprecated Use issuers instead
         */
        issuer?: Policy.Issuer;
        issuers?: Policy.Issuer[];
        must_staple?: number;
        renewal_window_ratio?: number;
        key_type?: string;
        storage?: Storage;
        on_demand?: boolean;
      }

      namespace Policy {
        type Issuer = Issuers.Acme
          | Issuers.Internal
          | Issuers.Zerossl;

        namespace Issuers {
          interface Acme {
            '@id'?: string;
            module: 'acme';
            ca?: string;
            test_ca?: string;
            email?: string;
            external_account?: {
              '@id'?: string;
              key_id?: string;
              hmac?: string;
            };
            acme_timeout?: Duration;
            challenges?: {
              '@id'?: string;
              http?: {
                '@id'?: string;
                disabled?: boolean;
                alternate_port?: number;
              };
              'tls-alpn'?: {
                '@id'?: string;
                disabled?: boolean;
                alternate_port?: number;
              };
              dns?: {
                '@id'?: string;
                provider?: NON_STANDARD;
                ttl?: number | string;
              };
              bind_host?: string;
            };
            trusted_roots_pem_files?: string[];
            preferred_chains?: {
              '@id'?: string;
              smallest?: boolean;
              root_common_name?: string[];
              any_common_name?: string[];
            };
          }

          interface Internal {
            '@id'?: string;
            module?: 'internal';
            ca?: string;
            lifetime?: Duration;
            sign_with_root?: boolean;
          }

          interface Zerossl {
            '@id'?: string;
            module: 'zerossl';
            ca?: string;
            test_ca?: string;
            email?: string;
            external_account?: {
              '@id'?: string;
              key_id?: string;
              mac_key?: string;
            };
            acme_timeout?: Duration;
            challenges?: {
              '@id'?: string;
              http?: {
                '@id'?: string;
                disabled?: boolean;
                alternate_port?: number;
              };
              'tls-alpn'?: {
                '@id'?: string;
                disabled?: boolean;
                alternat_port?: number;
              };
              dns?: {
                '@id'?: string;
                provider?: NON_STANDARD;
                ttl?: Duration;
                propagation_timeout?: Duration;
                resolvers?: string[];
              };
              bind_host?: string;
            }
            trusted_roots_pem_files?: string[];
            preferred_chains?: {
              '@id'?: string;
              smallest?: boolean;
              root_common_name?: string[];
              any_common_name?: string[];
            };
            api_key?: string;
          }
        }
      }

      interface OnDemand {
        '@id'?: string;
        rate_limit?: {
          '@id'?: string;
          interval?: Duration;
          burst?: number;
        };
        ask?: string;
      }
    }

    interface SessionTickets {
      '@id'?: string;
      key_source?: SessionTickets.KeySource;
      rotation_interval?: Duration;
      max_keys?: number;
      disable_rotation?: boolean;
      disabled?: boolean;
    }

    namespace SessionTickets {
      type KeySource = KeySources.Distributed
        | KeySources.Standard;

      namespace KeySources {
        interface Distributed {
          '@id'?: string;
          provider: 'distributed';
          storage?: Storage;
        }

        interface Standard {
          '@id'?: string;
          provider: 'standard';
        }
      }
    }
  }
}
