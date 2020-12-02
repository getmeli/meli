export function unique<T>(element: T, index: number, array: T[]): boolean {
  return array.indexOf(element) === index;
}
