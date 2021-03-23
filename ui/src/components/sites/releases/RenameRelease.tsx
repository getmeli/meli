import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '../../../commons/components/Button';
import { axios } from '../../../providers/axios';
import { CardModal } from '../../../commons/components/modals/CardModal';
import { useEnv } from '../../../providers/EnvProvider';
import { Release } from './release';
import { ReleaseNameInput } from './ReleaseNameInput';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';

function ModalContent({ releaseId, onRenamed }: {
  releaseId: string;
  onRenamed: (release: Release) => void;
}) {
  const env = useEnv();
  const methods = useForm({
    mode: 'onChange',
  });
  const [loading, setLoading] = useMountedState(false);
  const { handleSubmit, formState: { isDirty } } = methods;

  const onChange = formData => axios
    .put<Release>(`${env.MELI_API_URL}/api/v1/releases/${releaseId}`, formData)
    .then(({ data }) => data)
    .then(onRenamed)
    .catch(err => {
      toast.error(`Could not rename release: ${err}`);
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
        <ReleaseNameInput setInputRef={setInputRef} />
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

export function RenameRelease({
  children, className, releaseId, onRenamed,
}: {
  children;
  className?;
  releaseId: string;
  onRenamed: (release: Release) => void;
}) {
  const [isOpen, setIsOpen] = useMountedState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const renamed = val => {
    onRenamed(val);
    closeModal();
  };

  return (
    <>
      <div
        onClick={openModal}
        className={className}
      >
        {children}
      </div>
      <CardModal isOpen={isOpen} closeModal={closeModal} title="Rename release">
        <ModalContent onRenamed={renamed} releaseId={releaseId} />
      </CardModal>
    </>
  );
}
