import React, { useEffect, useState } from 'react';
import { uniqueId } from 'lodash';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { Release } from '../releases/release';
import { axios } from '../../../providers/axios';
import { Loader } from '../../../commons/components/Loader';
import { AlertError } from '../../../commons/components/AlertError';
import { Tooltip, tooltipToggle } from '../../../commons/components/Tooltip';

function useRelease(releaseId: string) {
  const [loading, setLoading] = useMountedState(!!releaseId);
  const [error, setError] = useState();
  const [release, setRelease] = useState<Release>();

  useEffect(() => {
    if (releaseId) {
      setLoading(true);
      setError(undefined);
      axios
        .get<Release>(`/api/v1/releases/${releaseId}`)
        .then(({ data }) => data)
        .then(setRelease)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [releaseId, setLoading]);

  return {
    release,
    error,
    loading,
  };
}

export function BranchRelease({ releaseId }: {
  releaseId: string;
}) {
  const [uid] = useState(uniqueId());
  const {
    loading, error, release,
  } = useRelease(releaseId);

  return loading ? (
    <Loader/>
  ) : error ? (
    <AlertError error={error}/>
  ) : (
    <>
      <div
        className="badge badge-primary ml-2"
        {...tooltipToggle(uid)}
      >
        {release.name}
      </div>
      <Tooltip id={uid}>Current release</Tooltip>
    </>
  );
}
