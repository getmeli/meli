import React, { useState } from 'react';
import { UserInvite } from './user-invite';
import { FromNow } from '../../commons/components/FromNow';
import { DeclineInvite } from './DeclineInvite';
import { UserOrg } from '../auth/user-org';
import { AcceptInvite } from './AcceptInvite';
import { useCurrentOrg } from '../../providers/OrgProvider';
import { routerHistory } from '../../providers/history';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { Bubble } from '../../commons/components/Bubble';
import styles from './UserInviteView.module.scss';
import { useMountedState } from '../../commons/hooks/use-mounted-state';

export function UserInviteView({ invite, token }: {
  invite: UserInvite;
  token: string;
}) {
  const { changeCurrentOrg } = useCurrentOrg();
  const [loading, setLoading] = useMountedState(false);
  const [error, setError] = useState();

  const onIgnore = () => {
    routerHistory.push('/');
  };

  const onAccept = (org: UserOrg) => {
    setLoading(true);
    changeCurrentOrg(org.org._id)
      .then(() => {
        routerHistory.push('/');
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const expired = new Date(invite.expiresAt).getTime() < Date.now();

  return (
    <div className="d-flex flex-column align-items-center">
      <h2>You're invited !</h2>
      <p>You are invited to join the workspace</p>
      <div className={styles.org}>
        <Bubble color={invite.org.color} src={invite.org.logo} className="mr-3" />
        <strong>{invite.org.name}</strong>
      </div>
      {invite.memberOptions.admin && (
        <p>
          You will have the privilege to be an
          <strong>admin</strong>
        </p>
      )}
      <p className="d-flex justify-content-between align-items-center">
        <DeclineInvite
          inviteId={invite._id}
          token={token}
          onIgnore={onIgnore}
          className="mr-2"
          disabled={expired}
        />
        <AcceptInvite
          inviteId={invite._id}
          token={token}
          onAccept={onAccept}
          disabled={expired}
        />
      </p>
      {loading && (
        <p className="text-center">
          <Loader />
        </p>
      )}
      {error && (
        <p>
          <AlertError error={error} />
        </p>
      )}
      <p className="text-center">
        {expired ? (
          <div className="text-danger">
            expired
          </div>
        ) : (
          <div className="text-muted">
            <FromNow date={invite.expiresAt} label="Expires" />
          </div>
        )}
      </p>
    </div>
  );
}
