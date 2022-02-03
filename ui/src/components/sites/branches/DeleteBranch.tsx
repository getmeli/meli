import React from "react";
import { toast } from "react-toastify";
import { Button } from "../../../commons/components/Button";
import { axios } from "../../../providers/axios";
import { CardModal } from "../../../commons/components/modals/CardModal";
import { useMountedState } from "../../../commons/hooks/use-mounted-state";
import { extractErrorMessage } from "../../../utils/extract-error-message";

export function DeleteBranch({
  siteId,
  branchId,
  className,
  children,
  onDelete,
}: {
  siteId: string;
  branchId: string;
  children: any;
  className?: string;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useMountedState(false);
  const [loading, setLoading] = useMountedState(false);

  const deleteToken = () => {
    setLoading(true);
    return axios
      .delete(`/api/v1/sites/${siteId}/branches/${branchId}`)
      .then(() => {
        setIsOpen(false);
        onDelete();
      })
      .catch((err) => {
        toast.error(`Could not delete branch: ${extractErrorMessage(err)}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <CardModal
        isOpen={isOpen}
        title="Delete branch"
        closeModal={() => setIsOpen(false)}
      >
        <p>Are you sure you want to delete this branch ?</p>
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
            onClick={deleteToken}
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
