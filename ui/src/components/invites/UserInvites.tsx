import React, { useEffect, useState } from 'react';
import { useEnv } from '../../providers/EnvProvider';
import { axios } from '../../providers/axios';
import { queryParams } from '../../utils/query-params';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { UserInvite } from './user-invite';
import { UserInviteView } from './UserInviteView';
import { useMountedState } from '../../commons/hooks/use-mounted-state';

export function UserInvites() {
  const { token } = queryParams();

  const env = useEnv();
  const [loading, setLoading] = useMountedState(!!token);
  const [error, setError] = useState();
  const [invite, setInvite] = useState<UserInvite>();

  useEffect(() => {
    if (token && env) {
      setLoading(true);
      axios
        .post<UserInvite>(`${env.MELI_API_URL}/api/v1/invites/${token}`, {
          token,
        })
        .then(({ data }) => data)
        .then(setInvite)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [env, token, setLoading]);

  return (
    <div className="container mt-5 pb-100">
      <div className="row">
        <div className="col">
          {!token ? (
            <div className="text-center">
              <h2>No token found</h2>
              <p>
                We could not find your invite token. There should be a
                <code>?token=...</code>
                {' '}
                in the URL
              </p>
            </div>
          ) : (
            loading ? (
              <Loader />
            ) : error ? (
              <AlertError error={error} />
            ) : (
              <UserInviteView invite={invite} token={token} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
