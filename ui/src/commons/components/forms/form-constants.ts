export const EMAIL_PATTERN = /^.+@.+$/;
export const STRING_MAX_LENGTH = 1000;
export const LONG_STRING_MAX_LENGTH = 5000;

// TODO could be loaded from backend or placed in a shared lib. Would be easier if mono repo.
export const SUBDOMAIN_PATTERN = /^[a-z0-9]?[a-z0-9-]*[a-z0-9]{1}$/;
export const COLOR_PATTERN = /^#[a-z0-9]{6}$/;

export const required = {
  value: true,
  message: 'Input is required',
};

export const isEmail = {
  value: EMAIL_PATTERN,
  message: 'Invalid email',
};

export const isSubdomain = {
  value: SUBDOMAIN_PATTERN,
  message: `Must match ${SUBDOMAIN_PATTERN}`,
};

export function maxLength(l?: number) {
  const max = l ?? STRING_MAX_LENGTH;
  return {
    value: max,
    message: `Max length is ${max}`,
  };
}

export function minLength(l: number) {
  return {
    value: l,
    message: `Min length is ${l}`,
  };
}
