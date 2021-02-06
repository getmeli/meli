declare namespace Caddy {
  interface Logging {
    '@id'?: string;
    sink?: {
      '@id'?: string;
      writer?: Logging.Writer;
    };
    logs?: { [name: string]: Logging.Log };
  }

  namespace Logging {
    type Writer = Writers.Discard
      | Writers.File
      | Writers.Net
      | Writers.Stderr
      | Writers.Stdout;

    namespace Writers {
      interface Discard {
        '@id'?: string;
        output: 'discard';
      }

      interface File {
        '@id'?: string;
        output: 'file';
        roll?: boolean;
        roll_size_mb?: number;
        roll_gzip?: boolean;
        roll_local_time?: boolean;
        roll_keep?: number;
        roll_keep_days?: number;
      }

      interface Net {
        '@id'?: string;
        output: 'net';
        address?: string;
      }

      interface Stderr {
        '@id'?: string;
        output: 'stderr';
      }

      interface Stdout {
        '@id'?: string;
        output: 'stdout';
      }
    }

    interface Log {
      '@id'?: string;
      writer?: Writer;
      encoder?: Encoder;
      level?: Log.Level;
      sampling?: Log.Sampling;
      include?: string[];
      exclude?: string[];
    }

    namespace Log {
      type Level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'PANIC' | 'FATAL';

      interface Sampling {
        '@id'?: string;
        interval?: number;
        first?: number;
        thereafter?: number;
      }
    }

    type Encoder = Encoders.Console
      | Encoders.Filter
      | Encoders.Json
      | Encoders.Logfmt
      | Encoders.SingleField;

    namespace Encoders {
      interface Console {
        '@id'?: string;
        format: 'console';
        message_key?: string;
        level_key?: string;
        time_key?: string;
        name_key?: string;
        caller_key?: string;
        stacktrace_key?: string;
        line_ending?: string;
        time_format?: string;
        duration_format?: string;
        level_format?: string;
      }

      interface Filter {
        '@id'?: string;
        format: 'filter';
        wrap?: Encoder;
        fields?: Fields;
      }

      type Fields = Fields.Delete
        | Fields.IpMask;

      namespace Fields {
        interface Delete {
          '@id'?: string;
          filter: 'delete';
        }

        interface IpMask {
          '@id'?: string;
          filter: 'ip_mask';
          ipv4_cidr?: number;
          ipv6_cidr?: number;
        }
      }

      interface Json {
        '@id'?: string;
        format: 'json';
        message_key?: string;
        level_key?: string;
        time_key?: string;
        name_key?: string;
        caller_key?: string;
        stacktrace_key?: string;
        line_ending?: string;
        time_format?: string;
        duration_format?: string;
        level_format?: string;
      }

      interface Logfmt {
        '@id'?: string;
        format: 'logfmt';
        message_key?: string;
        level_key?: string;
        time_key?: string;
        name_key?: string;
        caller_key?: string;
        stacktrace_key?: string;
        line_ending?: string;
        time_format?: string;
        duration_format?: string;
        level_format?: string;
      }

      interface SingleField {
        '@id'?: string;
        format: 'single_field';
        field?: string;
        fallback?: Encoder;
      }
    }
  }
}
