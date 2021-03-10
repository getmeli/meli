import { object, string } from 'joi';

export interface Header {
  name: string;
  value: string;
}

export const $header = object({
  name: string().required(),
  value: string().optional().empty(''),
});
