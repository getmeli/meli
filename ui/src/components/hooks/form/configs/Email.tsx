import { useFormContext } from 'react-hook-form';
import React from 'react';
import {
  isEmail, maxLength, required,
} from '../../../../commons/components/forms/form-constants';
import { InputError } from '../../../../commons/components/forms/InputError';

export function Email() {
  const { register, errors } = useFormContext();
  const input_to = 'config.to';
  return (
    <div className="form-group">
      <label
        htmlFor={input_to}
        className="form-label"
      >
        To
      </label>
      <input
        type="text"
        id={input_to}
        name={input_to}
        className="form-control"
        placeholder="status@smith.com"
        ref={register({
          required,
          maxLength: maxLength(),
          pattern: isEmail,
        })}
      />
      <InputError error={errors} path={input_to} />
    </div>
  );
}
