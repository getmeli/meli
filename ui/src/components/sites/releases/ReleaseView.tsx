import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {
  faEllipsisV, faHistory, faPencilAlt, faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { Release } from './release';
import { DeleteRelease } from './DeleteRelease';
import { useSite } from '../SiteView';
import { RenameRelease } from './RenameRelease';
import { Dropdown, dropdownToggle } from '../../../commons/components/dropdown/Dropdown';
import { DropdownLink } from '../../../commons/components/dropdown/DropdownLink';
import DropdownSeparator from '../../../commons/components/dropdown/DropdownSeparator';
import { AddBranch } from '../branches/AddBranch';
import { Branch } from '../branches/branch';
import { FromNow } from '../../../commons/components/FromNow';
import { ButtonIcon } from '../../../commons/components/ButtonIcon';
import { routerHistory } from '../../../providers/history';
import { useBranch } from '../branches/BranchView';
import { SetBranchRelease } from '../branches/release/SetBranchRelease';

export function ReleaseView({
  release, siteId, onDelete, onChange,
}: {
  release: Release;
  siteId: string;
  onDelete: () => void;
  onChange: (release: Release) => void;
}) {
  const [uid] = useState(uniqueId());
  const { site, setSite } = useSite();
  const branchContext = useBranch();

  const onBranchAdd = (branch: Branch) => {
    setSite({
      ...site,
      branches: [branch, ...site.branches],
    });
    routerHistory.push(`/sites/${siteId}/branches/${branch._id}`);
  };

  return (
    <div className="list-group-item d-flex justify-content-between align-items-center">
      <div className="flex-grow-1 d-flex align-items-center">
        <strong className="mr-3">{release.name}</strong>
        {!!branchContext?.branch && branchContext.branch.release === release._id && (
          <div className="badge badge-success">current</div>
        )}
      </div>

      <div className="d-flex align-items-center">
        <FromNow
          date={release.date}
          label="Created"
          className="ml-3"
        />
        <ButtonIcon className="ml-3" {...dropdownToggle(uid)}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </ButtonIcon>
        <Dropdown id={uid}>
          <RenameRelease releaseId={release._id} onRenamed={onChange}>
            <DropdownLink icon={<FontAwesomeIcon icon={faPencilAlt} fixedWidth />}>
              Rename
            </DropdownLink>
          </RenameRelease>
          <AddBranch siteId={siteId} releaseId={release._id} onAdded={onBranchAdd}>
            <DropdownLink icon={<FontAwesomeIcon icon={faPlus} fixedWidth />}>
              Create branch
            </DropdownLink>
          </AddBranch>
          {!!branchContext?.branch && (
            <SetBranchRelease
              branchId={branchContext.branch._id}
              branchName={branchContext.branch.name}
              siteId={siteId}
              releaseId={release._id}
              releaseName={release.name}
              onSet={() => {
                branchContext.setBranch({
                  ...branchContext.branch,
                  release: release._id,
                });
              }}
            >
              <DropdownLink icon={<FontAwesomeIcon icon={faHistory} fixedWidth />}>
                Rollback here
              </DropdownLink>
            </SetBranchRelease>
          )}
          <DropdownSeparator />
          <DeleteRelease releaseId={release._id} onDelete={onDelete}>
            <DropdownLink icon={<FontAwesomeIcon icon={faTrashAlt} fixedWidth />}>
              Delete
            </DropdownLink>
          </DeleteRelease>
        </Dropdown>
      </div>
    </div>
  );
}
