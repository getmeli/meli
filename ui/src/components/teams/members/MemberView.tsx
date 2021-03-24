import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { TeamMember } from './team-member';
import { DeleteMember } from './DeleteMember';
import { ButtonIcon } from '../../../commons/components/ButtonIcon';
import { useCurrentOrg } from '../../../providers/OrgProvider';

export function MemberView({
  member, teamId, onDelete,
}: {
  member: TeamMember;
  teamId: string;
  onDelete: () => void;
}) {
  const { currentOrg } = useCurrentOrg();
  return (
    <div className="list-group-item d-flex justify-content-between align-items-center">
      <div className="flex-grow-1 d-flex align-items-center">
        <strong className="mr-3">{member.name}</strong>
        {member.admin && (
          <span className="badge badge-danger ml-3">admin</span>
        )}
        {currentOrg.member._id === member.memberId && (
          <span className="badge badge-success ml-2">you</span>
        )}
      </div>

      <div className="d-flex align-items-center">
        <span className="text-muted">{member.email}</span>
        <DeleteMember teamId={teamId} memberId={member.memberId} onDelete={onDelete}>
          <ButtonIcon className="ml-3">
            <FontAwesomeIcon icon={faTimes} />
          </ButtonIcon>
        </DeleteMember>
      </div>
    </div>
  );
}
