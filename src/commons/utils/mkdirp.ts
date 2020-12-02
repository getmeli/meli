import { promisify } from 'util';
import { exists, promises } from 'fs';
import { tmpdir } from 'os';

const fsExists = promisify(exists);

export async function mkdirp(name: string): Promise<string> {
  const workspace = `./${tmpdir()}/${name}`;
  if (await fsExists(workspace)) {
    await promises.rmdir(workspace, {
      recursive: true,
    });
  }
  await promises.mkdir(workspace, {
    recursive: true,
  });
  return workspace;
}
