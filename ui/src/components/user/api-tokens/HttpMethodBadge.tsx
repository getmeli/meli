import classNames from 'classnames';
import React from 'react';

export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete';

function getMethodClass(method: HttpMethod) {
  switch (method) {
    case 'get':
      return 'success';
    case 'post':
      return 'primary';
    case 'put':
      return 'info';
    case 'patch':
      return 'warning';
    case 'delete':
      return 'danger';
    default:
      return 'primary';
  }
}

export function HttpMethodBadge({ method, className }: {
  method: HttpMethod;
  className?;
}) {
  return (
    <span className={classNames(className, 'badge', `badge-${getMethodClass(method)}`)}>
      {method.toUpperCase()}
    </span>
  );
}
