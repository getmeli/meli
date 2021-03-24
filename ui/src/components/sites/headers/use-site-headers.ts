import { useEffect, useState } from 'react';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { Header } from '../branches/header';
import { axios } from '../../../providers/axios';
import { Site } from '../site';

export function useSiteHeaders(siteId: string) {
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [headers, setHeaders] = useState<Header[]>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Site>(`/api/v1/sites/${siteId}`)
      .then(({ data }) => data.headers)
      .then(setHeaders)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [setLoading, siteId]);

  return {
    headers,
    setHeaders,
    error,
    loading,
  };
}
