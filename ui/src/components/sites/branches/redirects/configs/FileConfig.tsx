import { useFormContext } from 'react-hook-form';
import React from 'react';
import { InputError } from '../../../../../commons/components/forms/InputError';
import { FileRedirectConfig } from '../../branch-redirect';

export function FileConfig({ config, path }: {
  config: FileRedirectConfig;
  path: string;
}) {
  const { register, errors } = useFormContext();
  const input_content = `${path}.content`;
  return (
    <>
      <div className="form-group">
        <label htmlFor={input_content}>Content</label>
        <textarea
          name={input_content}
          id={input_content}
          ref={register()}
          defaultValue={config?.content}
          className="form-control"
        />
        <InputError error={errors} path={input_content} />
      </div>
    </>
  );
}
