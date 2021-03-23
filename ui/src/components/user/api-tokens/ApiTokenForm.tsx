import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import moment from 'moment';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { maxLength, required } from '../../../commons/components/forms/form-constants';
import { InputError } from '../../../commons/components/forms/InputError';
import { Button } from '../../../commons/components/Button';
import { ApiScopes } from './ApiScopes';
import { ApiScope } from './api-scope';

interface ActivePeriod {
  from: Date;
  to: Date;
}

export interface ApiTokenFormData {
  name: string;
  activePeriod: ActivePeriod;
  scopes: ApiScope[];
}

function ActivePeriod({ value, onChange }: {
  value?: ActivePeriod;
  onChange?: (value: ActivePeriod) => void;
}) {
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape>();
  return (
    <div className="form-group">
      <DateRangePicker
        startDate={moment(value.from)}
        startDateId="from"
        endDate={moment(value.to)}
        endDateId="to"
        onDatesChange={({ startDate, endDate }) => {
          onChange({
            from: startDate?.toDate(),
            to: endDate?.toDate(),
          });
        }}
        focusedInput={focusedInput}
        onFocusChange={setFocusedInput}
        showClearDates
      />
    </div>
  );
}

export function ApiTokenForm({
  value,
  onChange,
}: {
  value?: ApiTokenFormData;
  onChange: (token: ApiTokenFormData) => Promise<void>;
}) {
  const {
    reset, register, errors, handleSubmit, formState: { isDirty }, control,
  } = useForm<ApiTokenFormData>({
    mode: 'onChange',
  });
  const [loading, setLoading] = useMountedState(false);

  const onSubmit = (data: ApiTokenFormData) => {
    setLoading(true);
    onChange(data).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (value && reset) {
      reset(value);
    }
  }, [value, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group card">
        <div className="card-header">
          <strong>General settings</strong>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              ref={register({
                required,
                maxLength: maxLength(),
              })}
              className="form-control"
              placeholder="Steve's token"
              autoComplete="off"
            />
            <InputError error={errors} path="name" />
          </div>

          <div className="form-group">
            <label htmlFor="activePeriod">Active period</label>
            <Controller
              control={control}
              id="activePeriod"
              name="activePeriod"
              as={<ActivePeriod />}
              defaultValue={{
                from: moment(),
              }}
            />
          </div>
        </div>
      </div>

      <div className="form-group card">
        <div className="card-header">
          <strong>Scopes</strong>
        </div>
        <div className="card-body">
          <Controller
            control={control}
            name="scopes"
            render={({ value: scopes, onChange: scopesChanged }) => (
              <ApiScopes value={scopes} onChange={scopesChanged} />
            )}
            defaultValue={[]}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <Button
          type="submit"
          className="btn btn-primary"
          loading={loading}
          disabled={!isDirty}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
