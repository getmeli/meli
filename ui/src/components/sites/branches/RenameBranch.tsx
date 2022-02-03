import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../../commons/components/Button";
import { axios } from "../../../providers/axios";
import { CardModal } from "../../../commons/components/modals/CardModal";
import { Branch } from "./branch";
import { BranchNameInput } from "./BranchNameInput";
import { useMountedState } from "../../../commons/hooks/use-mounted-state";
import { extractErrorMessage } from "../../../utils/extract-error-message";

function ModalContent({
  siteId,
  branchId,
  onRenamed,
}: {
  siteId: string;
  branchId: string;
  onRenamed: (branch: Branch) => void;
}) {
  const methods = useForm({
    mode: "onChange",
  });
  const [loading, setLoading] = useMountedState(false);
  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  const onSubmit = (formData) => {
    setLoading(true);
    axios
      .put<Branch>(
        `/api/v1/sites/${siteId}/branches/${branchId}/name`,
        formData
      )
      .then(({ data }) => onRenamed(data))
      .catch((err) => {
        toast.error(`Could not rename branch: ${extractErrorMessage(err)}`);
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
        <BranchNameInput setInputRef={setInputRef} />
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

export function RenameBranch({
  children,
  className,
  siteId,
  branchId,
  onRenamed,
}: {
  children;
  className?;
  siteId: string;
  branchId: string;
  onRenamed: (branch: Branch) => void;
}) {
  const [isOpen, setIsOpen] = useMountedState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const renamed = (val) => {
    onRenamed(val);
    closeModal();
  };

  return (
    <>
      <div onClick={openModal} className={className}>
        {children}
      </div>
      <CardModal isOpen={isOpen} closeModal={closeModal} title="Rename branch">
        <ModalContent onRenamed={renamed} siteId={siteId} branchId={branchId} />
      </CardModal>
    </>
  );
}
