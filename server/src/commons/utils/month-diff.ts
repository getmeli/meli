export function monthDiff(d1: Date, d2: Date): number {
  return Math.abs((d2.getTime() - d1.getTime()) / 86400000 / 30.5);
}
