import React from 'react';
import { Loader } from './Loader';

export function CenteredLoader(props) {
  return (
    <div className="text-center" {...props}>
      <Loader />
    </div>
  );
}
