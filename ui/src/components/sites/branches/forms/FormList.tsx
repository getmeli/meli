import React, { useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Form } from '../../releases/release';
import { Button } from '../../../../commons/components/Button';
import { FormForm } from './FormForm';

interface FormData {
  forms: Form[];
}

export function FormList({ forms, onSubmit, submitting }: {
  forms: Form[];
  onSubmit: (forms: Form[]) => void;
  submitting: boolean;
}) {
  const methods = useForm({ mode: 'onChange' });
  const { control, handleSubmit, formState: { isDirty }, reset } = methods;
  const formForms = useFieldArray<Form>({ control, name: 'forms' });

  const submit = (formData: FormData) => {
    onSubmit(formData.forms);
  };

  useEffect(() => {
    if (forms && reset) {
      reset({
        forms,
      });
    }
  }, [forms, reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)}>
        {formForms.fields.map((form, index) => (
          <FormForm
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            value={form as Form}
            remove={() => formForms.remove(index)}
            className="mb-4"
          />
        ))}
        <button
          onClick={() => formForms.append({})}
          type="button"
          className="list-group-item list-group-item-action text-center"
        >
          Add form
        </button>

        <div className="form-group d-flex justify-content-end">
          {isDirty && (
            <Button
              type="button"
              className="mt-3 btn btn-outline-primary animate fadeIn"
              onClick={() => reset({ forms })}
              disabled={submitting}
            >
              Discard
            </Button>
          )}
          <Button
            type="submit"
            className="mt-3 ml-3 btn btn-primary"
            loading={submitting}
            disabled={submitting}
          >
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
