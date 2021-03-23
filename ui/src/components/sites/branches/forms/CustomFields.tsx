import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EmailForm, Form, FormType } from '../../releases/release';
import { EMAIL_PATTERN, maxLength, required } from '../../../../commons/components/forms/form-constants';
import { InputError } from '../../../../commons/components/forms/InputError';

function EmailFormFields({ value, index }: {
  value: EmailForm;
  index: number;
}) {
  const { register, errors } = useFormContext();
  const input = `forms[${index}]`;
  const input_recipient = `${input}.recipient`;

  return (
    <>
      <div className="form-group">
        <label htmlFor={input_recipient}>Recipient</label>
        <input
          type="text"
          id={input_recipient}
          name={input_recipient}
          ref={register({
            required,
            maxLength: maxLength(),
            pattern: EMAIL_PATTERN,
          })}
          className="form-control"
          placeholder="test@test.com"
          defaultValue={value?.recipient}
        />
        <InputError error={errors} path={input_recipient} />
      </div>
    </>
  );
}

export function CustomFields({ type, value, index }: {
  type: FormType;
  value: Form;
  index: number;
}) {
  switch (type) {
    case FormType.email:
      return <EmailFormFields value={value as EmailForm} index={index} />;
    case FormType.db:
    default:
      return <></>;
  }
}
