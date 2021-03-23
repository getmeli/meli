import React from 'react';

export function FullPageCentered({ children }: { children: any }) {
  return <div className="d-flex align-items-center justify-content-center vh-100 w-100">{children}</div>;
}
