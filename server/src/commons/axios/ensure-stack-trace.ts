import { AxiosInstance } from 'axios';
import { AxiosError } from './axios-error';

// https://github.com/axios/axios/issues/2387#issuecomment-652242713
export function ensureStackTrace(instance: AxiosInstance): AxiosInstance {
  instance.interceptors.request.use(config => {
    (config as any).errorContext = new Error('Thrown at:');
    return config;
  });
  instance.interceptors.response.use(undefined, async error => {
    const err = error.isAxiosError ? new AxiosError(error.message, error) : error;
    const originalStackTrace = error.config?.errorContext?.stack;
    if (originalStackTrace) {
      error.stack = `${error.stack}\n${originalStackTrace}`;
    }
    throw err;
  });
  return instance;
}
