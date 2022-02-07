import React from 'react';
import { toast } from 'react-toastify';
import { axios } from '../../providers/axios';
import { routerHistory } from '../../providers/history';
import { Button } from '../../commons/components/Button';
import { CardModal } from '../../commons/components/modals/CardModal';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { IsAdmin } from '../auth/IsAdmin';
import { extractErrorMessage } from '../../utils/extract-error-message';

export function DeleteProject({
  id, className, children,
}: {
  id: string;
  className?: string;
  children: any;
}) {
  const [isOpen, setIsOpen] = useMountedState(false);
  const [loading, setLoading] = useMountedState(false);

  const deleteProject = () => {
    setLoading(true);
    return axios
      .delete(`/api/v1/projects/${id}`)
      .then(() => {
        setIsOpen(false);
        routerHistory.push('/');
      })
      .catch(err => {
        toast.error(`Could not delete project: ${extractErrorMessage(err)}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <CardModal
        isOpen={isOpen}
        title="Delete project"
        closeModal={() => setIsOpen(false)}
      >
        <p>Are you sure you want to delete this project ? Sites and related data (releases, branches, etc.) will be deleted.</p>
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
            onClick={deleteProject}
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
