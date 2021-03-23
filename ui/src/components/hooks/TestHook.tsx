import React from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { Button } from '../../commons/components/Button';
import { axios } from '../../providers/axios';
import { useMountedState } from '../../commons/hooks/use-mounted-state';

export function TestHook({
  config, className, disabled,
}: {
  config: any;
  className?: string;
  disabled: boolean;
}) {
  const [loading, setLoading] = useMountedState(false);
  const test = () => {
    setLoading(true);
    axios
      .post(`/api/v1/sites/notifications/test`, config)
      .then(() => toast.success('It worked !'))
      .catch(err => toast.error(`It didnt work: ${err}`))
      .finally(() => setLoading(false));
  };
  return (
    <>
      <Button
        loading={loading}
        onClick={test}
        disabled={disabled}
        className={classNames('btn btn-sm btn-primary', className)}
      >
        Test
      </Button>
    </>
  );
}
