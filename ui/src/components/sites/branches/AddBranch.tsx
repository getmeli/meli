import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '../../../commons/components/Button';
import { axios } from '../../../providers/axios';
import { CardModal } from '../../../commons/components/modals/CardModal';
import { Branch } from './branch';
import { BranchNameInput } from './BranchNameInput';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';

function ModalContent({
  siteId, releaseId, onAdded,
}: {
  siteId: string;
  releaseId?: string;
  onAdded: (branch: Branch) => void;
}) {
  const methods = useForm({
    mode: 'onChange',
  });
  const [loading, setLoading] = useMountedState(false);
  const { handleSubmit, formState: { isDirty } } = methods;

  const onChange = formData => axios
    .post<Branch>(`/api/v1/sites/${siteId}/branches`, {
      ...formData,
      releaseId,
    })
    .then(({ data }) => data)
    .then(onAdded)
    .catch(err => {
      toast.error(`Could not create branch: ${err}`);
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
        <BranchNameInput setInputRef={setInputRef}/>
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

export function AddBranch({
  children, className, siteId, releaseId, onAdded,
}: {
  children;
  className?;
  siteId: string;
  releaseId?: string;
  onAdded: (branch: Branch) => void;
}) {
  const [isOpen, setIsOpen] = useMountedState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const added = val => {
    onAdded(val);
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
      <CardModal isOpen={isOpen} closeModal={closeModal} title="Add branch">
        <ModalContent onAdded={added} siteId={siteId} releaseId={releaseId}/>
      </CardModal>
    </>
  );
}
