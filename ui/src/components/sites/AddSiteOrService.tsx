import { uniqueId } from 'lodash';
import React, { useState } from 'react';
import { CardModal } from '../../commons/components/modals/CardModal';
import { Tooltip, tooltipToggle } from '../../commons/components/Tooltip';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { IsAdmin } from '../auth/IsAdmin';
import { AddStaticSiteOrServiceModal } from './AddStaticSiteOrServiceModal';

export function AddSiteOrService({
  projectId, children, className, tooltip = true,
}: {
  projectId: string;
  children;
  className?;
  tooltip?: boolean;
}) {
  const [uid] = useState(uniqueId());
  const [isOpen, setIsOpen] = useMountedState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <IsAdmin>
        <div
          onClick={openModal}
          className={className}
          {...tooltipToggle(uid)}
        >
          {children}
        </div>
      </IsAdmin>
      {tooltip && (
        <Tooltip id={uid} className="d-flex align-items-center">
          Add site
        </Tooltip>
      )}
      <CardModal isOpen={isOpen} closeModal={closeModal} title="Add site">
        <AddStaticSiteOrServiceModal projectId={projectId} closeModal={closeModal}/>
      </CardModal>
    </>
  );
}
