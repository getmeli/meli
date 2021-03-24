import { $formMapEntry, Form } from '../../forms/form';
import { object } from 'joi';

export interface SiteConfig {
  forms: {
    [name: string]: Form
  };
}

export const $meliConfig = object({
  forms: object().optional().pattern(/\w+/, $formMapEntry),
});
