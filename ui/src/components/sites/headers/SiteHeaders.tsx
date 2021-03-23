import React from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Header } from '../branches/header';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { Branch } from '../branches/branch';
import { HeaderList } from './HeaderList';
import { Loader } from '../../../commons/components/Loader';
import { AlertError } from '../../../commons/components/AlertError';
import { useEnv } from '../../../providers/EnvProvider';
import { axios } from '../../../providers/axios';
import { useSiteHeaders } from './use-site-headers';

function useSetSiteHeaders(
  siteId: string,
  setHeaders: (headers: Header[]) => void,
) {
  const [loading, setLoading] = useMountedState(false);
  const env = useEnv();

  const updateHeaders = (headers: Header[]) => {
    setLoading(true);
    axios
      .put<Branch>(`${env.MELI_API_URL}/api/v1/sites/${siteId}/headers`, {
        headers: headers || [],
      })
      .then(({ data }) => {
        setHeaders(data.headers);
        toast.success('Saved branch headers');
      })
      .catch(err => {
        toast.error(`Could not save headers: ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    updateHeaders,
    loading,
  };
}

export function SiteHeaders() {
  const { siteId } = useParams();
  const { headers, setHeaders, loading, error } = useSiteHeaders(siteId);
  const { loading: updating, updateHeaders } = useSetSiteHeaders(siteId, setHeaders);

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <div className="mt-4">
      <HeaderList
        headers={headers}
        onSubmit={updateHeaders}
        submitting={updating}
      />
    </div>
  );
}
