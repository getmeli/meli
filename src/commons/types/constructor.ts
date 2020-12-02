export interface Constructor<T = any, A extends any[] = any[]> extends Function {
  prototype: T;
  name: string;

  new(...args: A): T;
}
