declare namespace Caddy {
  interface Admin {
    disabled?: boolean;
    listen?: string;
    enforce_origin?: boolean;
    origins?: string[];
    config?: { persist?: boolean };
  }
}
