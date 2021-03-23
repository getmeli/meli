import { promises as fs } from 'fs';

export async function ensureEmptyDirectory(path: string): Promise<void> {
  await fs.rmdir(path, {
    recursive: true,
  });
  await fs.mkdir(path, {
    recursive: true,
  });
}
