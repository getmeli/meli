import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import styles from './HookForm.module.scss';
import { maxLength, required } from '../../../commons/components/forms/form-constants';
import { InputError } from '../../../commons/components/forms/InputError';
import { enumToArray } from '../../../commons/utils/enum-to-array';
import { Email } from './configs/Email';
import { Mattermost } from './configs/Mattermost';
import { Slack } from './configs/Slack';
import { Hook, HookType } from '../hook';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { Button } from '../../../commons/components/Button';
import { Web } from './configs/Web';
import { HookEvents } from './HookEvents';

const types = enumToArray(HookType);

function Config({ type }: {
  type: HookType;
}) {
  switch (type) {
    case HookType.email:
      return <Email />;
    case HookType.mattermost:
      return <Mattermost />;
    case HookType.slack:
      return <Slack />;
    case HookType.web:
      return <Web />;
    default:
      return <></>;
  }
}

export function HookForm({
  value,
  onChange,
}: {
  value?: Hook;
  onChange: (hook: Hook) => Promise<any>;
}) {
  const methods = useForm<Hook>();
  const {
    register, errors, watch, /* getValues, */ handleSubmit, formState: { isDirty }, reset,
  } = methods;

  // const getConfig = () => {
  //   const formData = getValues();
  //   return formData.config ? formData.config : undefined;
  // };
  // const config = getConfig();

  const type = watch('type');

  const [loading, setLoading] = useMountedState(false);

  const onSubmit = (data: Hook) => {
    setLoading(true);
    onChange(data).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (value && reset) {
      reset(value);
    }
  }, [value, reset]);

  return (
    <FormProvider {...methods}>
      <form className={classNames(styles.container)} onSubmit={handleSubmit(onSubmit)}>
        {/* <div className={classNames(styles.remove, 'd-flex justify-content-end')}> */}
        {/*  <TestHook */}
        {/*    config={config} */}
        {/*    disabled={!config} */}
        {/*    className="mr-3" */}
        {/*  /> */}
        {/* </div> */}

        <div className="card">
          <div className="card-header">
            <strong>General config</strong>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="type" className="form-label">Type</label>
              <select
                id="type"
                name="type"
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
              <InputError error={errors} path="type" />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                ref={register({
                  maxLength: maxLength(),
                })}
                className="form-control"
                placeholder="Pop champaign on new release"
                autoComplete="off"
              />
              <InputError error={errors} path="name" />
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-header">
            <strong>Config</strong>
          </div>
          <div className="card-body">
            <Config type={type} />
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-header">
            <strong>Events</strong>
          </div>
          <div className="card-body">
            <HookEvents />
          </div>
        </div>

        <Button loading={loading} type="submit" className="btn btn-primary mt-4" disabled={!isDirty}>
          Save
        </Button>
      </form>
    </FormProvider>
  );
}
