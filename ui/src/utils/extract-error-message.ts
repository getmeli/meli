import { AxiosError } from 'axios';

export function extractErrorMessage(err: any) {
  if (err.isAxiosError) {
    return (err as AxiosError).response.data.message;
  }
  return err.message;
}
