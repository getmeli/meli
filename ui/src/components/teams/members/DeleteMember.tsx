import React from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../../commons/components/Button';
import { axios } from '../../../providers/axios';
import { CardModal } from '../../../commons/components/modals/CardModal';
import { useEnv } from '../../../providers/EnvProvider';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { IsAdmin } from '../../auth/IsAdmin';

export function DeleteMember({
  teamId, memberId, className, children, onDelete,
}: {
  teamId: string;
  memberId: string;
  children: any;
  className?: string;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useMountedState(false);
  const [loading, setLoading] = useMountedState(false);
  const env = useEnv();

  const deleteMember = () => {
    setLoading(true);
    return axios
      .delete(`${env.MELI_API_URL}/api/v1/teams/${teamId}/members/${memberId}`)
      .then(() => {
        setIsOpen(false);
        onDelete();
      })
      .catch(err => {
        toast.error(`Could not delete member: ${err}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <CardModal
        isOpen={isOpen}
        title="Delete member"
        closeModal={() => setIsOpen(false)}
      >
        <p>Are you sure you want to delete this member ?</p>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <Button
            className="btn btn-danger ml-3"
            onClick={deleteMember}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </CardModal>

      <IsAdmin>
        <div onClick={() => setIsOpen(true)} className={className}>
          {children}
        </div>
      </IsAdmin>
    </>
  );
}
