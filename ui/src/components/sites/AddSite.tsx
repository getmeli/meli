import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { uniqueId } from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import { axios } from '../../providers/axios';
import { routerHistory } from '../../providers/history';
import { Tooltip, tooltipToggle } from '../../commons/components/Tooltip';
import { SiteNameInput } from './settings/SiteNameInput';
import { Button } from '../../commons/components/Button';
import { CardModal } from '../../commons/components/modals/CardModal';
import { Site } from './site';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { IsAdmin } from '../auth/IsAdmin';
import { extractErrorMessage } from '../../utils/extract-error-message';

function AddSiteModal({ projectId, closeModal }: { projectId; closeModal }) {
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
      toast.error(`Could not create site: ${extractErrorMessage(err)}`);
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
        <SiteNameInput setInputRef={setInputRef}/>
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
    </FormProvider>
  );
}

export function AddSite({
  projectId, children, className, tooltip = true,
}: {
  projectId: string;
  children;
  className?;
  tooltip?: boolean;
}) {
  const [uid] = useState(uniqueId());
  const [isOpen, setIsOpen] = useMountedState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <IsAdmin>
        <div
          onClick={openModal}
          className={className}
          {...tooltipToggle(uid)}
        >
          {children}
        </div>
      </IsAdmin>
      {tooltip && (
        <Tooltip id={uid} className="d-flex align-items-center">
          Add site
        </Tooltip>
      )}
      <CardModal isOpen={isOpen} closeModal={closeModal} title="Add site">
        <AddSiteModal closeModal={closeModal} projectId={projectId}/>
      </CardModal>
    </>
  );
}
