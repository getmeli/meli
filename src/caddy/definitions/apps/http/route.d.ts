declare namespace Caddy {
  namespace Http {
    interface Route {
      '@id'?: string;
      group?: string;
      match?: Route.Matcher[];
      handle?: Route.Handler[];
      terminal?: boolean;
    }
  }
}
