import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '../../commons/components/Button';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { axios } from '../../providers/axios';
import { routerHistory } from '../../providers/history';
import { SiteNameInput } from './settings/SiteNameInput';
import { Site } from './site';

interface AddSiteModalProps {
  projectId: string;
  closeModal: () => void;
  back: () => void;
}

export function AddSiteModal({ projectId, closeModal, back }: AddSiteModalProps) {
  const methods = useForm({
    mode: 'onChange',
  });
  const [loading, setLoading] = useMountedState(false);
  const { handleSubmit, formState: { isDirty } } = methods;

  const onChange = formData => axios
    .post<Site>(`/api/v1/projects/${projectId}/sites`, formData)
    .then(({ data }) => {
      routerHistory.push(`/sites/${data._id}`);
    })
    .finally(() => {
      closeModal();
    })
    .catch(err => {
      toast.error(`Could not create site: ${err}`);
    });

  const onSubmit = data => {
    setLoading(true);
    onChange(data).finally(() => setLoading(false));
  };

  const [inputRef, setInputRef] = useState<HTMLInputElement>();

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
    }
  }, [inputRef]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SiteNameInput setInputRef={setInputRef} type="static"/>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-primary" onClick={back}>
            Back
          </button>
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
    </FormProvider>
  );
}
