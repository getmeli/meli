import React from 'react';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../../../../commons/components/Button';
import { axios } from '../../../../providers/axios';
import { CardModal } from '../../../../commons/components/modals/CardModal';
import { useEnv } from '../../../../providers/EnvProvider';
import { isEmail, maxLength, required } from '../../../../commons/components/forms/form-constants';
import { InputError } from '../../../../commons/components/forms/InputError';
import styles from './AddInvite.module.scss';
import { OrgMember } from '../members/org-member';
import { useCurrentOrg } from '../../../../providers/OrgProvider';
import { Toggle } from '../../../../commons/components/forms/Toggle';
import { useMountedState } from '../../../../commons/hooks/use-mounted-state';

interface InviteRequest {
  email: string;
  admin: boolean;
}

function AddMemberModal({ closeModal, onAdded }: {
  closeModal;
  onAdded: (member: OrgMember) => void;
}) {
  const env = useEnv();
  const { currentOrg } = useCurrentOrg();
  const {
    register, errors, handleSubmit, formState: { isDirty }, control,
  } = useForm<InviteRequest>({
    mode: 'onChange',
  });
  const [loading, setLoading] = useMountedState(false);

  const onChange = (member: InviteRequest) => axios
    .post(`${env.MELI_API_URL}/api/v1/orgs/${currentOrg.org._id}/invites`, member)
    .then(({ data }) => {
      onAdded(data);
    })
    .then(closeModal)
    .catch(err => {
      toast.error(`Could not add invite: ${err}`);
    });

  const onSubmit = data => {
    setLoading(true);
    onChange(data).finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className="form-group flex-grow-1 col">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          ref={register({
            required,
            pattern: isEmail,
            maxLength: maxLength(),
          })}
          className="form-control"
          placeholder="steve@apple.com"
          autoComplete="off"
        />
        <InputError error={errors} path="email" />
      </div>
      <div className="form-group flex-grow-1 col">
        <Controller
          id="admin"
          name="admin"
          control={control}
          ref={register({
            required,
            maxLength: maxLength(),
          })}
          defaultValue={false}
          as={(
            <Toggle>
              Admin
            </Toggle>
          )}
        />
        <InputError error={errors} path="admin" />
      </div>
      <div className="d-flex justify-content-end">
        <Button
          type="submit"
          className="btn btn-primary"
          loading={loading}
          disabled={!isDirty}
        >
          Send
        </Button>
      </div>
    </form>
  );
}

export function AddInvite({
  children, className, onAdded,
}: {
  children;
  className?;
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
      <CardModal isOpen={isOpen} closeModal={closeModal} title="Invite org member">
        <AddMemberModal closeModal={closeModal} onAdded={onAdded} />
      </CardModal>
    </>
  );
}
