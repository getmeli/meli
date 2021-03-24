declare namespace Caddy {
  type Storage = Storages.FileSystem;

  namespace Storages {
    interface FileSystem {
      '@id'?: string;
      module: 'file_system';
      root?: string;
    }
  }
}
