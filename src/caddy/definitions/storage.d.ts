declare namespace Caddy {
  interface Storage {
    file_system?: Storages.FileSystem;
  }

  namespace Storages {
    interface FileSystem {
      module: 'file_system';
      root?: string;
    }
  }
}
