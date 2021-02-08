declare namespace Caddy {
  interface Pki {
    '@id'?: string;
    certificate_authorities?: { [id: string]: Pki.CertificateAuthority };
  }

  namespace Pki {
    interface CertificateAuthority {
      '@id'?: string;
      name?: string;
      root_common_name?: string;
      intermediate_common_name?: string;
      install_trust?: boolean;
      root?: Certificate;
      intermediate?: Certificate;
      storage?: Storage;
    }

    interface Certificate {
      '@id'?: string;
      certificate?: string;
      private_key?: string;
      format?: string;
    }
  }
}
