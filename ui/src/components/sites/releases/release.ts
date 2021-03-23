export enum FormType {
  db = 'db',
  email = 'email',
}

export interface FormBase {
  name: string;
}

export interface DbForm extends FormBase {
  type: FormType.db;
}

export interface EmailForm extends FormBase {
  type: FormType.email;
  recipient: string;
}

export type Form =
  | DbForm
  | EmailForm;

export interface Release {
  _id: string;
  name: string;
  date: Date;
  siteId: string;
  branches?: string[];
  forms?: Form[];
}
