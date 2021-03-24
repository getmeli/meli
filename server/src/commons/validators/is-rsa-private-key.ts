export function isRsaPrivateKey(value: string): string {
  if (!value.includes('-----BEGIN RSA PRIVATE KEY-----')
    || !value.includes('-----END RSA PRIVATE KEY-----')) {
    throw new Error('Invalid RSA private key');
  }

  return value;
}
