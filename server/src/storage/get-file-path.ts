import path from 'path';
import { env } from '../env/env';

export function getFilePath(id: string): string {
  return path.resolve(`${env.MELI_STORAGE_DIR}/${id}`);
}
