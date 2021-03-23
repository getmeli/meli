import { Constructor } from '../src/commons/types/constructor';

export function buildMock<T>(constructor: Constructor<T>, stub?: Partial<T>): T {
  const mock = {} as Partial<T>;

  for (let prototype = constructor.prototype; prototype; prototype = Object.getPrototypeOf(prototype)) {
    const descriptors = Object.getOwnPropertyDescriptors(prototype);
    for (const key in descriptors) {
      const descriptor = descriptors[key];
      if (typeof descriptor.value === 'function') {
        mock[key] = stub?.[key] ?? jest.fn();
      }
    }
  }

  // add extra props
  for (const key of Object.keys(stub || {})) {
    mock[key] = stub[key];
  }

  return mock as T;
}
