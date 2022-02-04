import React from 'react';
import { toast } from 'react-toastify';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { axios } from '../../providers/axios';
import { Button } from '../../commons/components/Button';
import { useAuth } from '../../providers/AuthProvider';
import { extractErrorMessage } from '../../utils/extract-error-message';

function Disconnect() {
  const [loading, setLoading] = useMountedState(false);
  const { signOut } = useAuth();

  const disconnect = () => {
    setLoading(true);
    return axios
      .put(`/api/v1/user/disconnect`)
      .then(() => {
        signOut();
      })
      .catch(err => {
        toast.error(`Could not delete invite: ${extractErrorMessage(err)}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="card">
      <div className="card-header no-border d-flex justify-content-between">
        <strong>Disconnect from all devices</strong>
        <Button className="btn btn-danger" loading={loading} onClick={disconnect}>
          disconnect
        </Button>
      </div>
    </div>
  );
}

export function UserSecurity() {
  return (
    <>
      <Disconnect/>
    </>
  );
}
