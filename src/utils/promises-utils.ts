export function sequential<T = any>(promises: Promise<T>[]): Promise<T[]> {
  let last: Promise<T> | undefined;
  const result: T[] = [];

  promises.forEach(promise => {
    last = last
      ? last.then(value => {
        result.push(value);
        return promise;
      })
      : promise;
  });

  return last
    ? last.then(() => result)
    : Promise.resolve([]);
}
