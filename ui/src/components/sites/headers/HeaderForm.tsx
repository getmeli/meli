import React from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { maxLength, required } from '../../../commons/components/forms/form-constants';
import { InputError } from '../../../commons/components/forms/InputError';
import { Header } from '../branches/header';

export interface HeaderFormData {
  headers: Header[];
}

export function HeaderForm({
  index, value, remove, className,
}: {
  index: number;
  value: Header;
  remove: () => void;
  className?;
}) {
  const { register, errors, getValues } = useFormContext<HeaderFormData>();
  const input = `headers[${index}]`;
  const input_name = `${input}.name`;
  const input_value = `${input}.value`;

  return (
    <div className={classNames(className, 'form-row')}>
      <div className="col">
        <div className="form-group">
          <input
            type="text"
            id={input_name}
            name={input_name}
            ref={register({
              required,
              maxLength: maxLength(),
              validate: currentValue => {
                const count = getValues().headers?.filter(val => val.name.toLowerCase() === currentValue.toLowerCase())?.length || 0;
                return count <= 1 ? undefined : 'Header name must be unique';
              },
            })}
            className="form-control"
            placeholder="X-Application-Name"
            defaultValue={value?.name}
          />
          <InputError error={errors} path={input_name} />
        </div>
      </div>
      <div className="col">
        <div className="form-group">
          <input
            type="text"
            id={input_value}
            name={input_value}
            ref={register({
              maxLength: maxLength(),
            })}
            className="form-control"
            placeholder="My App"
            defaultValue={value?.value}
          />
          <InputError error={errors} path={input_value} />
        </div>
      </div>
      <button type="button" onClick={remove} className="btn btn-danger col-1">
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}
