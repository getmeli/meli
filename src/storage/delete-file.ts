import { getFilePath } from './get-file-path';
import { promises } from 'fs';

export function deleteFile(id: string): Promise<void> {
  const filePath = getFilePath(id);
  return promises.unlink(filePath);
}
