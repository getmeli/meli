import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { uniqueId } from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import { axios } from '../../providers/axios';
import { Tooltip, tooltipToggle } from '../../commons/components/Tooltip';
import { OrgNameInput } from './settings/OrgNameInput';
import { Button } from '../../commons/components/Button';
import { CardModal } from '../../commons/components/modals/CardModal';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { UserOrg } from '../auth/user-org';

interface Form {
  name: string;
}

function Modal({ closeModal, onAdded }: {
  closeModal;
  onAdded: (org: UserOrg) => void;
}) {
  const methods = useForm<Form>({
    mode: 'onChange',
  });
  const [loading, setLoading] = useMountedState(false);
  const { handleSubmit, formState: { isDirty } } = methods;

  const onSubmit = (form: Form) => {
    setLoading(true);
    axios
      .post<UserOrg>(`/api/v1/orgs`, form)
      .then(({ data }) => {
        onAdded(data);
      })
      .finally(() => {
        closeModal();
      })
      .catch(err => {
        toast.error(`Could not create org: ${err}`);
      })
      .finally(() => setLoading(false));
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
        <OrgNameInput setInputRef={setInputRef}/>
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

export function AddOrg({
  children, className, tooltip = true, onAdded,
}: {
  children;
  className?;
  tooltip?: boolean;
  onAdded: (org: UserOrg) => void;
}) {
  const [uid] = useState(uniqueId());
  const [isOpen, setIsOpen] = useMountedState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div
        onClick={openModal}
        className={className}
        {...tooltipToggle(uid)}
      >
        {children}
      </div>
      {tooltip && (
        <Tooltip id={uid}>
          Create org
        </Tooltip>
      )}
      <CardModal isOpen={isOpen} closeModal={closeModal} title="Create org">
        <Modal closeModal={closeModal} onAdded={onAdded}/>
      </CardModal>
    </>
  );
}
