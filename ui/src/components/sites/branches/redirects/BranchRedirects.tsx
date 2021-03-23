import React, { useEffect, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useEnv } from '../../../../providers/EnvProvider';
import { useMountedState } from '../../../../commons/hooks/use-mounted-state';
import { axios } from '../../../../providers/axios';
import { Loader } from '../../../../commons/components/Loader';
import { AlertError } from '../../../../commons/components/AlertError';
import { Button } from '../../../../commons/components/Button';
import { BranchRedirectsFormData } from './branch-redirects-form-data';
import { BranchRedirectForm } from './BranchRedirectForm';
import { BranchRedirect, RedirectType } from '../branch-redirect';

function useBranchFiles(
  siteId: string,
  branchId: string,
) {
  const env = useEnv();
  const [loading, setLoading] = useMountedState(false);
  const [error, setError] = useState();
  const [redirects, setFiles] = useState<BranchRedirect[]>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<BranchRedirect[]>(`${env.MELI_API_URL}/api/v1/sites/${siteId}/branches/${branchId}/redirects`)
      .then(({ data }) => data)
      .then(setFiles)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, setLoading, siteId, branchId]);

  return {
    redirects,
    setFiles,
    error,
    loading,
  };
}

function useSetFiles(
  siteId: string,
  branchId: string,
  setFiles: (redirects: BranchRedirect[]) => void,
) {
  const [loading, setLoading] = useMountedState(false);
  const env = useEnv();

  const updateFiles = (formData: BranchRedirectsFormData) => {
    setLoading(true);
    axios
      .put<BranchRedirect[]>(`${env.MELI_API_URL}/api/v1/sites/${siteId}/branches/${branchId}/redirects`, {
        redirects: formData.redirects || [],
      })
      .then(({ data }) => {
        setFiles(data);
        toast.success('Saved branch redirects');
      })
      .catch(err => {
        toast.error(`Could not save branch redirects: ${err}`);
      })
      .finally(() => setLoading(false));
  };

  return {
    updateFiles,
    loading,
  };
}

export function BranchRedirects() {
  const { siteId, branchId } = useParams();
  const methods = useForm({
    mode: 'onChange',
  });
  const {
    control, handleSubmit, formState: { isDirty }, reset,
  } = methods;
  const formFiles = useFieldArray<BranchRedirect>({
    control,
    name: 'redirects',
  });

  const {
    redirects, setFiles, loading, error,
  } = useBranchFiles(siteId, branchId);
  const { loading: updating, updateFiles } = useSetFiles(siteId, branchId, setFiles);

  useEffect(() => {
    if (redirects && reset) {
      reset({
        redirects,
      });
    }
  }, [redirects, reset]);

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(updateFiles)}>

        {formFiles.fields.map((branchFile, index) => (
          <BranchRedirectForm
            key={branchFile.path || branchFile.id}
            index={index}
            redirect={branchFile as BranchRedirect}
            remove={() => formFiles.remove(index)}
            className="mb-4"
          />
        ))}
        <button
          onClick={() => formFiles.append({
            type: RedirectType.file,
          })}
          type="button"
          className="list-group-item list-group-item-action text-center"
        >
          Add file
        </button>

        <div className="form-group d-flex justify-content-end">
          {isDirty && (
            <Button
              type="button"
              className="mt-3 btn btn-outline-primary animate fadeIn"
              onClick={() => reset({
                redirects,
              })}
              disabled={updating}
            >
              Discard
            </Button>
          )}
          <Button
            type="submit"
            className="mt-3 ml-3 btn btn-primary"
            loading={loading || updating}
            disabled={!isDirty || updating}
          >
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
