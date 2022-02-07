import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Loader } from '../../../../commons/components/Loader';
import { AlertError } from '../../../../commons/components/AlertError';
import { Invite } from './invite';
import { axios } from '../../../../providers/axios';
import { InviteView } from './InviteView';
import { AddInvite } from './AddInvite';
import { useCurrentOrg } from '../../../../providers/OrgProvider';
import { useMountedState } from '../../../../commons/hooks/use-mounted-state';
import { ButtonIcon } from '../../../../commons/components/ButtonIcon';
import { extractErrorMessage } from '../../../../utils/extract-error-message';

function sortInvites(a: Invite, b: Invite): number {
  return new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime();
}

export function Invites() {
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [items, setItems] = useState<Invite[]>();
  const { currentOrg } = useCurrentOrg();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios.get(`/api/v1/orgs/${currentOrg.org._id}/invites`)
      .then(({ data }) => data)
      .then(setItems)
      .catch(setError)
      .catch(err => toast.error(`Could not list invites: ${extractErrorMessage(err)}`))
      .finally(() => setLoading(false));
  }, [currentOrg, setLoading]);

  const onAdd = invite => {
    setItems([invite, ...items].sort(sortInvites));
  };

  const onDelete = (inviteId: string) => {
    setItems(items.filter(({ _id }) => _id !== inviteId));
  };

  return (
    <div className="mt-4 card">
      <div className="card-header d-flex justify-content-between">
        <div>
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2"/>
          <strong>Invites</strong>
        </div>
        <AddInvite onAdded={onAdd}>
          <ButtonIcon>
            <FontAwesomeIcon icon={faPlus}/>
          </ButtonIcon>
        </AddInvite>
      </div>
      <div className="card-body">
        {loading ? (
          <Loader/>
        ) : error ? (
          <AlertError error={error}/>
        ) : items.length === 0 ? (
          <div className="text-center">No invites to show</div>
        ) : (
          <ul className="list-group">
            {items.map(invite => (
              <InviteView
                key={invite._id}
                invite={invite}
                onDelete={() => onDelete(invite._id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
