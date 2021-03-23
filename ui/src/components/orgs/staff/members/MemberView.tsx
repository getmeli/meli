import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { uniqueId } from 'lodash';
import { toast } from 'react-toastify';
import { OrgMember } from './org-member';
import { DeleteMember } from './DeleteMember';
import { ButtonIcon } from '../../../../commons/components/ButtonIcon';
import { Toggle } from '../../../../commons/components/forms/Toggle';
import { Dropdown, dropdownToggle } from '../../../../commons/components/dropdown/Dropdown';
import { useEnv } from '../../../../providers/EnvProvider';
import { axios } from '../../../../providers/axios';
import { useCurrentOrg } from '../../../../providers/OrgProvider';
import { Loader } from '../../../../commons/components/Loader';
import { DropdownLink } from '../../../../commons/components/dropdown/DropdownLink';
import { useMountedState } from '../../../../commons/hooks/use-mounted-state';
import { IsOwner } from '../../../auth/IsOwner';

function AdminToggle({ member, setMember }: {
  member: OrgMember;
  setMember: (member: OrgMember) => void;
}) {
  const env = useEnv();
  const [loading, setLoading] = useMountedState(false);

  const toggle = () => {
    setLoading(true);
    axios
      .put<OrgMember>(`${env.MELI_API_URL}/api/v1/members/${member._id}`, {
        admin: !member.admin,
      })
      .then(({ data }) => data)
      .then(setMember)
      .catch(err => {
        toast.error(`Could not toggle admin: ${err}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Toggle
      togglePosition="right"
      value={member.admin}
      onChange={toggle}
      disabled={loading}
    >
      {loading && (
        <Loader className="mr-2" />
      )}
      admin
    </Toggle>
  );
}

export function MemberView({
  member, setMember, onDelete,
}: {
  member: OrgMember;
  setMember: (member: OrgMember) => void;
  onDelete: () => void;
}) {
  const [uid] = useState(uniqueId());
  const { currentOrg } = useCurrentOrg();

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center bg-light">
      <div className="flex-grow-1 d-flex align-items-center">
        <strong className="mr-3">{member.name}</strong>
        <span className="text-muted">{member.email}</span>
        {member.owner && (
          <span className="badge badge-danger ml-3">owner</span>
        )}
        {currentOrg.member._id === member._id && (
          <span className="badge badge-success ml-2">you</span>
        )}
      </div>

      <div className="d-flex align-items-center">
        <IsOwner>
          {!member.owner && (
          <AdminToggle
            member={member}
            setMember={setMember}
          />
          )}
          <ButtonIcon className="ml-3" {...dropdownToggle(uid)}>
            <FontAwesomeIcon icon={faEllipsisV} />
          </ButtonIcon>
          <Dropdown id={uid}>
            <DeleteMember memberId={member._id} onDelete={onDelete}>
              <DropdownLink icon={<FontAwesomeIcon icon={faTrashAlt} />} disabled={member.owner}>
                Delete
              </DropdownLink>
            </DeleteMember>
          </Dropdown>
        </IsOwner>
      </div>
    </li>
  );
}
