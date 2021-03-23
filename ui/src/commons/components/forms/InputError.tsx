import React from 'react';
import get from 'lodash/get';

export function InputError({
  error, className, path,
}: {
  error: any;
  path: string;
  className?: string;
}) {
  const err = get(error, path);
  return err ? (
    <small className={`text-danger ${className}`}>
      {err.message}
    </small>
  ) : null;
}
