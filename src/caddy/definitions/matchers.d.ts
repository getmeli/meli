declare namespace Caddy {
  namespace Http {
    namespace Route {

      interface Matcher {
        '@id'?: string;
        execnopmatch?: NON_STANDARD;
        expression?: string;
        file?: Matchers.File;
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
        remote_ip?: {
          '@id'?: string;
          ranges?: string[]
        };
        vars?: { [variable: string]: string };
        vars_regexp?: { [variable: string]: MatchRegexp };
      }

      interface MatchRegexp {
        '@id'?: string;
        name?: string;
        pattern?: string;
      }

      namespace Matchers {
        type Expression = string;

        interface File {
          '@id'?: string;
          root?: string;
          try_files?: string[];
          try_policy?: 'first_exist' | 'smallest_size' | 'largest_size' | 'most_recently_modified';
          split_path?: string[];
        }
      }
    }
  }
}
