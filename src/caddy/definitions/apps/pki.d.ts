declare namespace Caddy {
  interface Pki {
    certificate_authorities?: { [id: string]: Pki.CertificateAuthority };
  }

  namespace Pki {
    interface CertificateAuthority {
      name?: string;
      root_common_name?: string;
      intermediate_common_name?: string;
      install_trust?: boolean;
      root?: Certificate;
      intermediate?: Certificate;
      storage?: Storage;
    }

    interface Certificate {
      certificate?: string;
      private_key?: string;
      format?: string;
    }
  }
}
