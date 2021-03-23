export function debounceTime<T>(
  cb: (val: any) => Promise<T> | T,
  time: number,
): (val: any) => Promise<T> {
  let timeout;
  return val => {
    if (timeout) {
      clearTimeout(timeout);
    }
    return new Promise((resolve, reject) => {
      timeout = setTimeout(
        async () => {
          try {
            const res = await cb(val);
            resolve(res);
          } catch (e) {
            reject(e);
          }
        },
        time,
      );
    });
  };
}
