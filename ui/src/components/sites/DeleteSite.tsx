import React from 'react';
import { toast } from 'react-toastify';
import { axios } from '../../providers/axios';
import { routerHistory } from '../../providers/history';
import { Button } from '../../commons/components/Button';
import { CardModal } from '../../commons/components/modals/CardModal';
import { useMountedState } from '../../commons/hooks/use-mounted-state';

export function DeleteSite({
  id, teamId, className, children,
}: {
  id: string;
  teamId: string;
  className?: string;
  children: any;
}) {
  const [isOpen, setIsOpen] = useMountedState(false);
  const [loading, setLoading] = useMountedState(false);

  const deleteSite = () => {
    setLoading(true);
    return axios
      .delete(`/api/v1/sites/${id}`)
      .then(() => {
        setIsOpen(false);
        routerHistory.push(`/teams/${teamId}/sites`);
      })
      .catch(err => {
        toast.error(`Could not delete site: ${err}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <CardModal
        isOpen={isOpen}
        title="Delete site"
        closeModal={() => setIsOpen(false)}
      >
        <p>Are you sure you want to delete this token ?</p>
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
            onClick={deleteSite}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </CardModal>
      <div onClick={() => setIsOpen(true)} className={className}>
        {children}
      </div>
    </>
  );
}
