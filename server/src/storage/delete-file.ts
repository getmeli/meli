import { getFilePath } from './get-file-path';
import { promises } from 'fs';

async function fileExists(path: string): Promise<boolean> {
  try {
    await promises.stat(path);
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteFile(id: string): Promise<void> {
  const filePath = getFilePath(id);

  const exists = await fileExists(filePath);
  if (!exists) {
    return;
  }

  return promises.unlink(filePath);
}
