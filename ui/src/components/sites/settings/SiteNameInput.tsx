import { useFormContext } from 'react-hook-form';
import React from 'react';
import { toast } from 'react-toastify';
import { Env } from '../../../providers/EnvProvider';
import { isSubdomain, maxLength, required } from '../../../commons/components/forms/form-constants';
import { debounceTime } from '../../../utils/debounce-time';
import { InputError } from '../../../commons/components/forms/InputError';
import { axios } from '../../../providers/axios';

async function validateName(env: Env, name: string, previousName?: string): Promise<string | undefined> {
  if (!name) {
    return undefined;
  }
  if (name === previousName) {
    return undefined;
  }
  return axios
    .post<string | undefined>(`/api/v1/sites.validate/name`, {
      name,
    })
    .then(({ data }) => data || undefined)
    .catch(err => {
      toast.error(`Could not validate site name: ${err}`);
      return undefined;
    });
}

export function SiteNameInput({ setInputRef, previousName }: {
  setInputRef?: (input: HTMLInputElement) => void;
  previousName?: string;
}) {
  const { register, errors } = useFormContext();

  const ref = input => {
    if (setInputRef) {
      setInputRef(input);
    }
    register({
      required,
      maxLength: maxLength(),
      pattern: isSubdomain,
      validate: debounceTime<string | undefined>(val => validateName(val, previousName), 300),
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
        placeholder="lisa"
        autoComplete="off"
      />
      <InputError error={errors} path="name"/>
    </div>
  );
}
