import React from "react";
import { toast } from "react-toastify";
import { Button } from "../../../commons/components/Button";
import { axios } from "../../../providers/axios";
import { CardModal } from "../../../commons/components/modals/CardModal";
import { useMountedState } from "../../../commons/hooks/use-mounted-state";
import { extractErrorMessage } from "../../../utils/extract-error-message";

export function DeleteRelease({
  releaseId,
  className,
  children,
  onDelete,
}: {
  releaseId: string;
  children: any;
  className?: string;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useMountedState(false);
  const [loading, setLoading] = useMountedState(false);

  const deleteRelease = () => {
    setLoading(true);
    return axios
      .delete(`/api/v1/releases/${releaseId}`)
      .then(() => {
        setIsOpen(false);
        onDelete();
      })
      .catch((err) => {
        toast.error(`Could not delete release: ${extractErrorMessage(err)}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <CardModal
        isOpen={isOpen}
        title="Delete release"
        closeModal={() => setIsOpen(false)}
      >
        <p>Are you sure you want to delete this release ?</p>
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
            onClick={deleteRelease}
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
