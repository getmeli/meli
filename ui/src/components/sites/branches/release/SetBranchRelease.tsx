import React from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../../../commons/components/Button';
import { axios } from '../../../../providers/axios';
import { CardModal } from '../../../../commons/components/modals/CardModal';
import { useMountedState } from '../../../../commons/hooks/use-mounted-state';
import { Branch } from '../branch';

export function SetBranchRelease({
  siteId, branchId, releaseId, className, children, onSet, branchName, releaseName,
}: {
  siteId: string;
  branchId: string;
  releaseId: string;
  branchName: string;
  releaseName: string;
  children: any;
  className?: string;
  onSet: () => void;
}) {
  const [isOpen, setIsOpen] = useMountedState(false);
  const [loading, setLoading] = useMountedState(false);

  const setBranchRelease = () => {
    setLoading(true);
    return axios
      .put<Branch>(`/api/v1/sites/${siteId}/branches/${branchId}/release`, {
        release: releaseId,
      })
      .then(() => {
        setIsOpen(false);
        onSet();
      })
      .catch(err => {
        toast.error(`Could not set branch release: ${err}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <CardModal
        isOpen={isOpen}
        title="Set branch release"
        closeModal={() => setIsOpen(false)}
      >
        <p>
          Are you sure you want to rollback branch
          {' '}
          <strong>{branchName}</strong>
          {' '}
          to release
          {' '}
          <strong>{releaseName}</strong>
          {' '}
          ?
        </p>
        <div className="d-flex align-items-center justify-content-end">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <Button
            className="btn btn-danger ml-3"
            onClick={setBranchRelease}
            loading={loading}
          >
            Rollback
          </Button>
        </div>
      </CardModal>
      <div onClick={() => setIsOpen(true)} className={className}>
        {children}
      </div>
    </>
  );
}
