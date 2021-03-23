export function dedupSlashes(str: string): string {
  return str ? str.replace(/(([^:]|^)\/)\/+/g, '$1') : str;
}
