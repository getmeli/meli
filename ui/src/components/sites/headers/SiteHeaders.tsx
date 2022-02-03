import React from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Header } from "../branches/header";
import { useMountedState } from "../../../commons/hooks/use-mounted-state";
import { Branch } from "../branches/branch";
import { HeaderList } from "./HeaderList";
import { Loader } from "../../../commons/components/Loader";
import { AlertError } from "../../../commons/components/AlertError";
import { axios } from "../../../providers/axios";
import { useSiteHeaders } from "./use-site-headers";
import { extractErrorMessage } from "../../../utils/extract-error-message";

function useSetSiteHeaders(
  siteId: string,
  setHeaders: (headers: Header[]) => void
) {
  const [loading, setLoading] = useMountedState(false);

  const updateHeaders = (headers: Header[]) => {
    setLoading(true);
    axios
      .put<Branch>(`/api/v1/sites/${siteId}/headers`, {
        headers: headers || [],
      })
      .then(({ data }) => {
        setHeaders(data.headers);
        toast.success("Saved branch headers");
      })
      .catch((err) => {
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

export function SiteHeaders() {
  const { siteId } = useParams<any>();
  const { headers, setHeaders, loading, error } = useSiteHeaders(siteId);
  const { loading: updating, updateHeaders } = useSetSiteHeaders(
    siteId,
    setHeaders
  );

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
