import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Invite } from './invite';
import { DeleteInvite } from './DeleteInvite';
import { FromNow } from '../../../../commons/components/FromNow';
import { ButtonIcon } from '../../../../commons/components/ButtonIcon';

export function InviteView({ invite, onDelete }: {
  invite: Invite;
  onDelete: () => void;
}) {
  const expired = new Date(invite.expiresAt).getTime() < Date.now();

  return (
    <div className="list-group-item d-flex justify-content-between align-items-center">
      <div className="flex-grow-1 d-flex align-items-center">
        <strong className="mr-3">{invite.email}</strong>
        {invite.memberOptions.admin && (
          <span className="badge badge-primary">admin</span>
        )}
      </div>

      <div className="d-flex align-items-center">
        {expired ? (
          <div className="text-danger">
            expired
          </div>
        ) : (
          <>
            <div className="badge badge-warning mr-3">
              pending invitation
            </div>
            <FromNow date={invite.expiresAt} label="Expires" />
          </>
        )}
        <DeleteInvite inviteId={invite._id} onDelete={onDelete}>
          <ButtonIcon className="ml-3">
            <FontAwesomeIcon icon={faTimes} />
          </ButtonIcon>
        </DeleteInvite>
      </div>
    </div>
  );
}
