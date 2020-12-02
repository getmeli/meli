export function base64Encode(raw: string, encoding: BufferEncoding = 'utf-8'): string {
  return Buffer.from(raw, encoding).toString('base64');
}

export function base64Decode(encoded: string, encoding: BufferEncoding = 'utf-8'): string {
  return Buffer.from(encoded, 'base64').toString(encoding);
}
