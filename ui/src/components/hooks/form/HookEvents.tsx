import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Controller, useFormContext } from 'react-hook-form';
import { useHookContext } from '../HookProvider';
import { useEnv } from '../../../providers/EnvProvider';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { axios } from '../../../providers/axios';
import { Loader } from '../../../commons/components/Loader';
import { AlertError } from '../../../commons/components/AlertError';
import { Toggle } from '../../../commons/components/forms/Toggle';

export function HookEvents() {
  const { context } = useHookContext();
  const { control } = useFormContext();

  const env = useEnv();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [events, setEvents] = useState<string[]>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios.get<string[]>(`${env.MELI_API_URL}/api/v1/${context}/hook-events`)
      .then(({ data }) => data)
      .then(setEvents)
      .catch(setError)
      .catch(err => toast.error(`Could not list hook events: ${err}`))
      .finally(() => setLoading(false));
  }, [env, setLoading, context]);

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <Controller
      control={control}
      name="events"
      defaultValue={[]}
      render={({ value, onChange }) => (
        <ul className="list-group">
          {events.length === 0 ? (
            <>No events to show</>
          ) : (
            events.map(event => (
              <Toggle
                key={event}
                className="list-group-item"
                value={value.includes(event)}
                onChange={isOn => {
                  onChange(isOn ? [event, ...value] : value.filter(ev => ev !== event));
                }}
              >
                <strong>{event}</strong>
              </Toggle>
            ))
          )}
        </ul>
      )}
    />
  );
}
