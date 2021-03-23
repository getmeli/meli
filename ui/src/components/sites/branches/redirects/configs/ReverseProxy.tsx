import { useFormContext } from 'react-hook-form';
import React from 'react';
import { InputError } from '../../../../../commons/components/forms/InputError';
import { maxLength, required } from '../../../../../commons/components/forms/form-constants';
import { ReverseProxyRedirectConfig } from '../../branch-redirect';

export function ReverseProxy({ config, path }: {
  config: ReverseProxyRedirectConfig;
  path: string;
}) {
  const { register, errors } = useFormContext();
  const input_url = `${path}.url`;
  const input_strip_path_prefix = `${path}.stripPathPrefix`;
  return (
    <>
      <div className="form-group">
        <label
          htmlFor={input_url}
          className="form-label"
        >
          URL
        </label>
        <input
          type="text"
          id={input_url}
          name={input_url}
          className="form-control"
          placeholder="https://my-company.com/old-page"
          ref={register({
            required,
            maxLength: maxLength(),
          })}
          defaultValue={config?.url}
        />
        <InputError error={errors} path={input_url} />
      </div>
      <div className="form-group">
        <label
          htmlFor={input_strip_path_prefix}
          className="form-label"
        >
          Strip path prefix
        </label>
        <input
          type="text"
          id={input_strip_path_prefix}
          name={input_strip_path_prefix}
          className="form-control"
          placeholder="/api"
          ref={register({
            maxLength: maxLength(),
          })}
          defaultValue={config?.stripPathPrefix}
        />
        <InputError error={errors} path={input_strip_path_prefix} />
      </div>
    </>
  );
}
