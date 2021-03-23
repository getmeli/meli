import React from 'react';
import { Loader } from './Loader';

export function FullPageLoader() {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 w-100">
      <Loader />
    </div>
  );
}
