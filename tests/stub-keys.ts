import {readFileSync} from 'fs';

export const privateKey = readFileSync('./keys/private.pem').toString();
export const publicKey = readFileSync('./keys/public.pem').toString();
