import { AxiosError } from 'axios';

export function extractErrorMessage(err: any) {
  let message: string;
  if (err.isAxiosError) {
    message = (err as AxiosError).response?.data?.message;
  }
  return message || err.message;
}
