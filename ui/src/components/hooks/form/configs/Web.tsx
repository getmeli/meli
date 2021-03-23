import { useFormContext } from 'react-hook-form';
import React, { useState } from 'react';
import { maxLength, required } from '../../../../commons/components/forms/form-constants';
import { InputError } from '../../../../commons/components/forms/InputError';
import { randomString } from '../../../../commons/utils/random-string';

export function Web() {
  const { register, errors } = useFormContext();
  const [randomSecret] = useState(randomString(32));
  const input_url = 'config.url';
  const input_secret = 'config.secret';
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
          placeholder="https://hooks.my-company.com"
          ref={register({
            required,
            maxLength: maxLength(),
          })}
        />
        <InputError error={errors} path={input_url} />
      </div>
      <div className="form-group">
        <label
          htmlFor={input_secret}
          className="form-label"
        >
          Secret
        </label>
        <input
          type="text"
          id={input_secret}
          name={input_secret}
          className="form-control"
          placeholder="status@smith.com"
          ref={register({
            required,
            maxLength: maxLength(),
          })}
          defaultValue={randomSecret}
        />
        <InputError error={errors} path={input_secret} />
      </div>
    </>
  );
}
