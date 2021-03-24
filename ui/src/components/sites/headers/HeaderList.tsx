import React, { useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Header } from '../branches/header';
import { Button } from '../../../commons/components/Button';
import { HeaderForm, HeaderFormData } from './HeaderForm';

export function HeaderList({ headers, onSubmit, submitting }: {
  headers: Header[];
  onSubmit: (headers: Header[]) => void;
  submitting: boolean;
}) {
  const methods = useForm({ mode: 'onChange' });
  const { control, handleSubmit, formState: { isDirty }, reset } = methods;
  const formHeaders = useFieldArray<Header>({ control, name: 'headers' });

  const submit = (formData: HeaderFormData) => {
    onSubmit(formData.headers);
  };

  useEffect(() => {
    if (headers && reset) {
      reset({
        headers,
      });
    }
  }, [headers, reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)}>
        {formHeaders.fields.map((header, index) => (
          <HeaderForm
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            value={header as Header}
            remove={() => formHeaders.remove(index)}
          />
        ))}
        <button
          onClick={() => formHeaders.append({})}
          type="button"
          className="list-group-item list-group-item-action text-center"
        >
          Add header
        </button>

        <div className="form-group d-flex justify-content-end">
          {isDirty && (
            <Button
              type="button"
              className="mt-3 btn btn-outline-primary animate fadeIn"
              onClick={() => reset({ headers })}
              disabled={submitting}
            >
              Discard
            </Button>
          )}
          <Button
            type="submit"
            className="mt-3 ml-3 btn btn-primary"
            loading={submitting}
            disabled={!isDirty || submitting}
          >
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
