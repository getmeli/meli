import { useCallback } from 'react';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import { Site } from './site';
import { Page } from '../../commons/types/page';
import { PaginationData } from '../../commons/components/Pagination';
import { useCurrentOrg } from '../../providers/OrgProvider';
import { useMountedState } from '../../commons/hooks/use-mounted-state';

export interface ListSitesQuery extends PaginationData {
  search?: string;
}

interface UseSites {
  cb: (query?: ListSitesQuery) => void;
  data: Page<Site>;
  loading: boolean;
  error?: any;
}

export function useSites(): UseSites {
  const env = useEnv();
  const { currentOrg } = useCurrentOrg();

  const [loading, setLoading] = useMountedState(false);
  const [error, setError] = useMountedState<any>();
  const [data, setData] = useMountedState<Page<Site>>();

  const cb = useCallback((query?: ListSitesQuery) => {
    setLoading(true);
    axios
      .get<Page<Site>>(`${env.MELI_API_URL}/api/v1/orgs/${currentOrg.org._id}/sites`, {
        params: query,
      })
      .then(res => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, currentOrg, setData, setError, setLoading]);

  return {
    cb,
    data,
    loading,
    error,
  };
}
