/**
 * Generate a `next` function used for express handlers along with a `wait` promise that can be awaited on for tests.
 * Usage:
 * ```
 * const {next, wait} = nextWaitGenerator();
 * handler(req, res, next);
 * const result = await wait;
 * ```
 *
 * @param timeoutMilliseconds Time after which the test should fail if next wasn't called (in milliseconds)
 */
export function nextWaitGenerator(timeoutMilliseconds = 50) {
  let next;
  const wait = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Test timeout')), timeoutMilliseconds);
    next = jest.fn((...args) => {
      clearTimeout(timeout);
      if (args[0] instanceof Error) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(...args);
      } else {
        (resolve as any)(...args);
      }
    });
  });

  return {
    next,
    wait,
  };
}
