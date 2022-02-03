import React from "react";
import { toast } from "react-toastify";
import { axios } from "../../providers/axios";
import { routerHistory } from "../../providers/history";
import { Button } from "../../commons/components/Button";
import { CardModal } from "../../commons/components/modals/CardModal";
import { useMountedState } from "../../commons/hooks/use-mounted-state";
import { extractErrorMessage } from "../../utils/extract-error-message";

export function DeleteSite({
  id,
  projectId,
  className,
  children,
}: {
  id: string;
  projectId: string;
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
        routerHistory.push(`/projects/${projectId}/sites`);
      })
      .catch((err) => {
        toast.error(`Could not delete site: ${extractErrorMessage(err)}`);
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
