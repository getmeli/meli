import React from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Button } from '../../../commons/components/Button';
import { axios } from '../../../providers/axios';
import { CardModal } from '../../../commons/components/modals/CardModal';
import { Token } from './token';
import { maxLength, required } from '../../../commons/components/forms/form-constants';
import { InputError } from '../../../commons/components/forms/InputError';
import styles from './AddToken.module.scss';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { extractErrorMessage } from '../../../utils/extract-error-message';

function AddTokenModal({
  closeModal, siteId, onAdded,
}: {
  closeModal;
  siteId: string;
  onAdded: (token: Token) => void;
}) {
  const {
    register, errors, handleSubmit, formState: { isDirty },
  } = useForm({
    mode: 'onChange',
  });
  const [loading, setLoading] = useMountedState(false);

  const onChange = token => axios
    .post(`/api/v1/sites/${siteId}/tokens`, token)
    .then(({ data }) => {
      onAdded(data);
    })
    .then(closeModal)
    .catch(err => {
      toast.error(`Could not create token: ${extractErrorMessage(err)}`);
    });

  const onSubmit = data => {
    setLoading(true);
    onChange(data).finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className="form-group flex-grow-1 col">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          ref={register({
            required,
            maxLength: maxLength(),
          })}
          className="form-control"
          placeholder="Steve's token"
          autoComplete="off"
        />
        <InputError error={errors} path="name"/>
      </div>
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
  );
}

export function AddToken({
  children, className, siteId, onAdded,
}: {
  children;
  className?;
  siteId;
  onAdded;
}) {
  const [isOpen, setIsOpen] = useMountedState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div onClick={openModal} className={className}>
        {children}
      </div>
      <CardModal isOpen={isOpen} closeModal={closeModal} title="Create token">
        <AddTokenModal closeModal={closeModal} siteId={siteId} onAdded={onAdded}/>
      </CardModal>
    </>
  );
}
