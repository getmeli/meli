declare namespace Caddy {
  interface Tls {
    certificates?: Tls.Certificates;
    automation?: Tls.Automation;
    session_tickets?: TODO;
    cache?: {
      capacity?: number;
    };
  }

  namespace Tls {
    interface Certificates {
      automate?: string[];
      load_files?: Certificates.LoadFilesEntry[];
      load_folders?: string[];
      load_pem?: Certificates.LoadPemEntry[];
    }

    namespace Certificates {
      interface LoadFilesEntry {
        certificate?: string;
        key?: string;
        format?: 'pem' | string;
        tags?: string[];
      }

      interface LoadPemEntry {
        certificate?: string;
        key?: string;
        tags?: string[];
      }
    }

    interface Automation {
      policies?: Automation.Policy[];
      on_demand?: Automation.OnDemand;
      ocsp_interval?: Duration;
      renew_interval?: Duration;
    }

    namespace Automation {
      interface Policy {
        subjects?: string[];
        issuer?: Policy.Issuer;
        must_staple?: number;
        renewal_window_ratio?: number;
        key_type: string;
        storage?: TODO;
        on_demand?: boolean;
      }

      namespace Policy {
        type Issuer = Issuers.Acme
          | Issuers.Internal
          | Issuers.Zerossl;

        namespace Issuers {
          interface Acme {
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

          interface Internal {
            module?: 'internal';
            ca?: string;
            lifetime?: Duration;
            sign_with_root?: boolean;
          }

          interface Zerossl {
            module: 'zerossl';
            // TODO
          }
        }
      }

      interface OnDemand {
        rate_limit?: {
          interval?: Duration;
          burst?: number;
        };
        ask?: string;
      }
    }
  }
}
