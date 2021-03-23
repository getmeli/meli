import React from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { Button } from '../../commons/components/Button';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import { UserOrg } from '../auth/user-org';
import { useMountedState } from '../../commons/hooks/use-mounted-state';

export function AcceptInvite({
  inviteId, className, onAccept, token, disabled,
}: {
  token: string;
  inviteId: string;
  disabled: boolean;
  onAccept: (org: UserOrg) => void;
  className?: string;
}) {
  const env = useEnv();
  const [loading, setLoading] = useMountedState(false);

  const accept = () => {
    setLoading(true);
    return axios
      .put<UserOrg>(`${env.MELI_API_URL}/api/v1/invites/${inviteId}/accept`, {
        token,
      })
      .then(({ data }) => data)
      .then(onAccept)
      .catch(err => {
        toast.error(`Could not delete invite: ${err}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Button
        onClick={accept}
        className={classNames(className, 'btn btn-success')}
        loading={loading}
        disabled={disabled}
      >
        Accept
      </Button>
    </>
  );
}
