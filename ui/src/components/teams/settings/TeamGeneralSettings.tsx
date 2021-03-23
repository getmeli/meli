import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './TeamGeneralSettings.module.scss';
import { Button } from '../../../commons/components/Button';
import { TeamNameInput } from './TeamNameInput';
import { useTeam } from '../TeamView';
import { axios } from '../../../providers/axios';
import { InputError } from '../../../commons/components/forms/InputError';
import { COLOR_PATTERN, required } from '../../../commons/components/forms/form-constants';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';

interface Settings {
  name: string;
  color: string;
}

export function TeamGeneralSettings() {
  const { teamId } = useParams<any>();
  const { team, setTeam } = useTeam();

  const methods = useForm<Settings>({
    mode: 'onChange',
  });
  const {
    errors, register, reset, handleSubmit, formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (team && reset) {
      reset(team);
    }
  }, [team, reset]);

  const [loading, setLoading] = useMountedState(false);

  const onSubmit = (settings: Settings) => {
    setLoading(true);
    axios
      .put<Settings>(`/api/v1/teams/${teamId}`, settings)
      .then(({ data }) => data)
      .then(setTeam)
      .then(() => toast.success('Team saved'))
      .catch(err => toast.error(`Could not update team: ${err}`))
      .finally(() => setLoading(false));
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
      >

        <div className="mt-4 card">
          <div className="card-header">
            <strong>Team</strong>
          </div>
          <div className="card-body">
            <TeamNameInput/>
            <div className="form-group">
              <label htmlFor="color" className="form-label">Color</label>
              <input
                type="color"
                id="color"
                name="color"
                ref={register({
                  required,
                  pattern: COLOR_PATTERN,
                })}
                className="form-control"
                placeholder="my-team"
                autoComplete="off"
                defaultValue="#000000"
              />
              <InputError error={errors} path="color"/>
            </div>
          </div>
        </div>

        <div className="form-group d-flex justify-content-end">
          {/* TODO use http://reactcommunity.org/react-transition-group/css-transition */}
          {isDirty && (
            <button
              type="button"
              className="mt-4 btn btn-outline-primary animate fadeIn"
              onClick={() => reset(team)}
            >
              Discard
            </button>
          )}
          <Button
            type="submit"
            className="mt-4 ml-3 btn btn-primary"
            loading={loading}
            disabled={!isDirty}
          >
            Save
          </Button>
        </div>

      </form>
    </FormProvider>
  );
}
