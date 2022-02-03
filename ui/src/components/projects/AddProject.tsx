import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { uniqueId } from "lodash";
import { FormProvider, useForm } from "react-hook-form";
import { useShortcut } from "../../commons/keyboard/use-shortcut";
import { ADD_PROJECT_SHORTCUT_KEY } from "../../commons/keyboard/shortcuts-keys";
import { axios } from "../../providers/axios";
import { routerHistory } from "../../providers/history";
import { Tooltip, tooltipToggle } from "../../commons/components/Tooltip";
import { ProjectNameInput } from "./settings/ProjectNameInput";
import { Button } from "../../commons/components/Button";
import { CardModal } from "../../commons/components/modals/CardModal";
import { KeyboardShortcut } from "../../commons/components/KeyboardShortcut";
import { isMac, isWindows } from "../../commons/utils/os";
import { Project } from "./project";
import { useCurrentOrg } from "../../providers/OrgProvider";
import { useMountedState } from "../../commons/hooks/use-mounted-state";
import { IsAdmin } from "../auth/IsAdmin";
import { extractErrorMessage } from "../../utils/extract-error-message";

function AddProjectModal({
  closeModal,
  onAdded,
}: {
  closeModal;
  onAdded?: (project: Project) => void;
}) {
  const methods = useForm({
    mode: "onChange",
  });
  const [loading, setLoading] = useMountedState(false);
  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;
  const { currentOrg } = useCurrentOrg();

  const onChange = (formData) =>
    axios
      .post<Project>(`/api/v1/orgs/${currentOrg.org._id}/projects`, formData)
      .then(({ data }) => {
        if (onAdded) {
          onAdded(data);
        }
        routerHistory.push(`/projects/${data._id}`);
      })
      .finally(() => {
        closeModal();
      })
      .catch((err) => {
        toast.error(`Could not create project: ${extractErrorMessage(err)}`);
      });

  const onSubmit = (data) => {
    setLoading(true);
    onChange(data).finally(() => setLoading(false));
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
        <ProjectNameInput setInputRef={setInputRef} />
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

export function AddProject({
  children,
  className,
  tooltip = true,
  onAdded,
}: {
  children;
  className?;
  tooltip?: boolean;
  onAdded?: (project: Project) => void;
}) {
  const [uid] = useState(uniqueId());
  const [isOpen, setIsOpen] = useMountedState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useShortcut(ADD_PROJECT_SHORTCUT_KEY, () => setIsOpen(true));

  const shortCut = isMac() ? "⌘" : isWindows() ? "Ctrl" : undefined;

  return (
    <>
      <IsAdmin>
        <div onClick={openModal} className={className} {...tooltipToggle(uid)}>
          {children}
        </div>
      </IsAdmin>
      {tooltip && (
        <Tooltip id={uid} className="d-flex align-items-center">
          Add project
          {shortCut && (
            <>
              {" "}
              -
              <KeyboardShortcut className="ml-2" icon={false}>
                {shortCut} + {ADD_PROJECT_SHORTCUT_KEY}
              </KeyboardShortcut>
            </>
          )}
        </Tooltip>
      )}
      <CardModal isOpen={isOpen} closeModal={closeModal} title="Add project">
        <AddProjectModal closeModal={closeModal} onAdded={onAdded} />
      </CardModal>
    </>
  );
}
