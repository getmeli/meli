import { AsyncValidationOptions } from 'joi';

export const APP_NAME = 'Meli';
export const APP_URL = 'https://meli.sh';

export const JOI_OPTIONS: AsyncValidationOptions = {
  abortEarly: true,
  stripUnknown: true,
  convert: true,
};
export const STRING_MAX_LENGTH = 1000;
export const LONG_STRING_MAX_LENGTH = 5000;
export const ARRAY_MAX = 1000;
export const STRIPE_SIGNATURE_HEADER = 'stripe-signature';
export const SUBDOMAIN_PATTERN = /^[a-z0-9]?[a-z0-9-]*[a-z0-9]{1}$/;
export const COLOR_PATTERN = /^#[a-z0-9]{6}$/;
