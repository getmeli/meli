import { useFormContext } from 'react-hook-form';
import React from 'react';
import { maxLength, required } from '../../../commons/components/forms/form-constants';
import { InputError } from '../../../commons/components/forms/InputError';

export function ProjectNameInput({ setInputRef }: {
  setInputRef?: (input: HTMLInputElement) => void;
}) {
  const { register, errors } = useFormContext();

  const ref = input => {
    if (setInputRef) {
      setInputRef(input);
    }
    register({
      required,
      maxLength: maxLength(),
    })(input);
  };

  return (
    <div className="form-group">
      <label htmlFor="name" className="form-label">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        ref={ref}
        className="form-control"
        placeholder="my-project"
        autoComplete="off"
      />
      <InputError error={errors} path="name" />
    </div>
  );
}
