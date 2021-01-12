import path from 'path';
import { env } from '../env/env';
import { promises } from 'fs';
import { uuid } from '../utils/uuid';
import { getFilePath } from './get-file-path';

export interface StoredFile {
  id: string;
  type: string;
  name: string;
  size: number;
}

export async function storeFile(file: Express.Multer.File): Promise<StoredFile> {
  const fileId = uuid();
  const filePath = getFilePath(fileId);
  await promises.mkdir(env.MELI_STORAGE_DIR, { recursive: true });
  await promises.rename(path.join(file.destination, file.filename), filePath);
  return {
    id: fileId,
    type: file.mimetype,
    name: file.originalname,
    size: file.size,
  };
}
