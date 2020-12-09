import multer from 'multer';
import { env } from './env/env';

export const upload = multer({
  dest: env.MELI_TMP_DIRECTORY,
});
