import { alternatives, object, string } from 'joi';
import { STRING_MAX_LENGTH } from '../../constants';

export interface FormBase {
  name: string;
}

export interface EmailForm extends FormBase {
  type: 'email';
  recipient: string;
}

export type Form =
  | EmailForm;

const formBase = {
  name: string().required().pattern(/[a-zA-Z_]+/).max(STRING_MAX_LENGTH),
};

const $emailForm = {
  type: string().required().valid('email'),
  recipient: string().optional().email().max(STRING_MAX_LENGTH),
};

export const $formMapEntry = alternatives(
  object($emailForm),
);

export const $formArrayItem = alternatives(
  object({
    ...formBase,
    ...$emailForm,
  }),
);
