import React from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import { Form, FormType } from '../../releases/release';
import { InputError } from '../../../../commons/components/forms/InputError';
import { maxLength, required } from '../../../../commons/components/forms/form-constants';
import { CustomFields } from './CustomFields';

const types = Object.values(FormType);

export function FormForm({
  index, value, remove, className,
}: {
  index: number;
  value: Form;
  remove: () => void;
  className?;
}) {
  const { register, errors, getValues, watch } = useFormContext();
  const input = `forms[${index}]`;
  const input_type = `${input}.type`;
  const input_name = `${input}.name`;

  const type = watch(input_type);

  return (
    <div className={classNames(className, 'card')}>
      <div className="card-body">
        <div className="form-group">
          <label htmlFor={input_type} className="form-label">Type</label>
          <select
            id={input_type}
            name={input_type}
            ref={register({
              required,
            })}
            className="custom-select"
            defaultValue={value?.type}
          >
            {types.map(val => (
              <option value={val} key={val}>
                {val}
              </option>
            ))}
          </select>
          <InputError error={errors} path={input_type} />
        </div>
        <div className="form-group">
          <label htmlFor={input_name}>Name</label>
          <input
            type="text"
            id={input_name}
            name={input_name}
            ref={register({
              required,
              maxLength: maxLength(),
              validate: currentValue => {
                const count = getValues().forms?.filter(val => val.name.toLowerCase() === currentValue.toLowerCase())?.length || 0;
                return count <= 1 ? undefined : 'Form name must be unique';
              },
              pattern: /[a-zA-Z_]+/,
            })}
            className="form-control"
            placeholder="form2"
            defaultValue={value?.name}
          />
          <InputError error={errors} path={input_name} />
        </div>
        <CustomFields value={value} index={index} type={type} />
        <div className="d-flex justify-content-end form-group">
          <button type="button" onClick={remove} className="btn btn-danger">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
