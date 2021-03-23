export function enumToArray(e): string[] {
  return Array.from(new Set(Object.keys(e)));
}
