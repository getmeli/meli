export function basicAuth(user: string, password: string): string {
  const data = `${user}:${password}`;
  return `Basic ${Buffer.from(data).toString('base64')}`;
}
