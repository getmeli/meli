import React from 'react';
import { Alert } from './Alert';

export function AlertError({
  error, children, className,
}: {
  error?: any;
  children?: any;
  className?: string;
}) {
  return (
    <Alert type="danger" className={className}>
      {children || error.toString()}
    </Alert>
  );
}
