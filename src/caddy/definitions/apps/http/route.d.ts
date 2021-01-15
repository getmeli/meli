declare namespace Caddy {
  namespace Http {
    interface Route {
      group?: string;
      match?: Route.Matcher[];
      handle?: Route.Handler[];
      terminal?: boolean;
    }

    namespace Route {
      interface Matcher {
        execnopmatch?: NON_STANDARD;
        expression?: string; // TODO check
        file?: {
          root?: string;
          try_files?: string[];
          try_policy?: 'first_exist' | 'smallest_size' | 'largest_size' | 'most_recently_modified';
          split_path?: string[];
        };
        header?: { [header: string]: string[] };
        header_regexp?: { [header: string]: MatchRegexp };
        host?: string[];
        maxmind_geolocation?: NON_STANDARD;
        method?: string[];
        not?: Matcher[];
        path?: string[];
        path_regexp?: MatchRegexp;
        protocol?: string;
        query?: { [param: string]: string[] };
        remote_ip?: { ranges?: string[] };
        vars?: { [variable: string]: string };
        vars_regexp?: { [variable: string]: MatchRegexp };
      }

      interface MatchRegexp {
        name?: string;
        pattern?: string;
      }

      namespace Matchers {

      }
    }
  }
}
