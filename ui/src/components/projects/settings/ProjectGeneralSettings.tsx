import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './ProjectGeneralSettings.module.scss';
import { Button } from '../../../commons/components/Button';
import { ProjectNameInput } from './ProjectNameInput';
import { useProject } from '../ProjectView';
import { axios } from '../../../providers/axios';
import { InputError } from '../../../commons/components/forms/InputError';
import { COLOR_PATTERN, required } from '../../../commons/components/forms/form-constants';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';

interface Settings {
  name: string;
  color: string;
}

export function ProjectGeneralSettings() {
  const { projectId } = useParams<any>();
  const { project, setProject } = useProject();

  const methods = useForm<Settings>({
    mode: 'onChange',
  });
  const {
    errors, register, reset, handleSubmit, formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (project && reset) {
      reset(project);
    }
  }, [project, reset]);

  const [loading, setLoading] = useMountedState(false);

  const onSubmit = (settings: Settings) => {
    setLoading(true);
    axios
      .put<Settings>(`/api/v1/projects/${projectId}`, settings)
      .then(({ data }) => data)
      .then(setProject)
      .then(() => toast.success('Project saved'))
      .catch(err => toast.error(`Could not update project: ${err}`))
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
            <strong>Project</strong>
          </div>
          <div className="card-body">
            <ProjectNameInput/>
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
                placeholder="my-project"
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
              onClick={() => reset(project)}
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
