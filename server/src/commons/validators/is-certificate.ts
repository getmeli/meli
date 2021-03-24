export function isCertificate(value: string): string {
  if (!value.includes('-----BEGIN CERTIFICATE-----')
    || !value.includes('-----END CERTIFICATE-----')) {
    throw new Error('Invalid PEM certificate');
  }

  return value;
}
