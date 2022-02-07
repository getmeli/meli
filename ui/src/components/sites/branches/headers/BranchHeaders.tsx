import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useMountedState } from '../../../../commons/hooks/use-mounted-state';
import { axios } from '../../../../providers/axios';
import { Loader } from '../../../../commons/components/Loader';
import { AlertError } from '../../../../commons/components/AlertError';
import { Branch } from '../branch';
import { Header } from '../header';
import { HeaderList } from '../../headers/HeaderList';
import { useSiteHeaders } from '../../headers/use-site-headers';
import { extractErrorMessage } from '../../../../utils/extract-error-message';

function useBranchHeaders(
  siteId: string,
  branchId: string,
) {
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [headers, setHeaders] = useState<Header[]>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Branch>(`/api/v1/sites/${siteId}/branches/${branchId}`)
      .then(({ data }) => data.headers)
      .then(setHeaders)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [setLoading, siteId, branchId]);

  return {
    headers,
    setHeaders,
    error,
    loading,
  };
}

function useSetBranchHeaders(
  siteId: string,
  branchId: string,
  setHeaders: (headers: Header[]) => void,
) {
  const [loading, setLoading] = useMountedState(false);

  const updateHeaders = (headers: Header[]) => {
    setLoading(true);
    axios
      .put<Branch>(`/api/v1/sites/${siteId}/branches/${branchId}/headers`, {
        headers: headers || [],
      })
      .then(({ data }) => {
        setHeaders(data.headers);
        toast.success('Saved branch headers');
      })
      .catch(err => {
        toast.error(`Could not save headers: ${extractErrorMessage(err)}`);
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

function SiteHeaders({ siteId }: {
  siteId: string;
}) {
  const { headers, loading, error } = useSiteHeaders(siteId);

  return loading ? (
    <Loader/>
  ) : error ? (
    <AlertError error={error}/>
  ) : (
    <>
      <div className="d-flex justify-content-between mb-3 d-flex align-items-center">
        <h2 className="mb-0">Headers set at site level</h2>
        <Link to={`/sites/${siteId}/settings/headers`}>
          Edit
          {' '}
          <FontAwesomeIcon icon={faPen} className="ml-2"/>
        </Link>
      </div>
      <table className="table">
        <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
        </tr>
        </thead>
        <tbody>
        {headers.map(({ name, value }) => (
          <tr key={name}>
            <td>{name}</td>
            <td>{value}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
}

export function BranchHeaders() {
  const { siteId, branchId } = useParams<any>();
  const { headers, setHeaders, loading, error } = useBranchHeaders(siteId, branchId);
  const { loading: updating, updateHeaders } = useSetBranchHeaders(siteId, branchId, setHeaders);

  return loading ? (
    <Loader/>
  ) : error ? (
    <AlertError error={error}/>
  ) : (
    <>
      <h2>Branch headers</h2>
      <HeaderList
        headers={headers}
        onSubmit={updateHeaders}
        submitting={updating}
      />
      <SiteHeaders
        siteId={siteId}
      />
    </>
  );
}
