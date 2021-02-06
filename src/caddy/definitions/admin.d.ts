declare namespace Caddy {
  interface Admin {
    '@id'?: string;
    disabled?: boolean;
    listen?: string;
    enforce_origin?: boolean;
    origins?: string[];
    config?: Admin.Config;
  }

  namespace Admin {
    interface Config {
      '@id'?: string;
      persist?: boolean
    }
  }
}
