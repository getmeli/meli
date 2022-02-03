import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useHookContext } from "../HookProvider";
import { PaginationData } from "../../../commons/components/Pagination";
import { LoadMore } from "../../../commons/components/LoadMore";
import { useMountedState } from "../../../commons/hooks/use-mounted-state";
import { axios } from "../../../providers/axios";
import { HookDeliveryView } from "./HookDeliveryView";
import { HookDelivery } from "./hook-delivery";
import { Loader } from "../../../commons/components/Loader";
import { AlertError } from "../../../commons/components/AlertError";
import { EmptyList } from "../../../commons/components/EmptyList";
import { HookDeliveryIcon } from "../../icons/HookDeliveryIcon";
import { extractErrorMessage } from "../../../utils/extract-error-message";

export function HookDeliveries() {
  const { context } = useHookContext();
  const { hookId } = useParams<any>();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [deliveries, setDeliveries] = useState<HookDelivery[]>();
  const itemsRef = useRef<HookDelivery[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 0,
    size: 10,
  });
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get(`/api/v1/${context}/hooks/${hookId}/deliveries`, {
        params: pagination,
      })
      .then(({ data }) => {
        itemsRef.current.push(...data.items);
        setDeliveries(itemsRef.current);
        setHasMore(data.count > itemsRef.current.length);
      })
      .catch(setError)
      .catch((err) =>
        toast.error(
          `Could not list hook deliveries: ${extractErrorMessage(err)}`
        )
      )
      .finally(() => setLoading(false));
  }, [pagination, hookId, setLoading, context]);

  const nextPage = () => {
    setPagination({
      ...pagination,
      page: pagination.page + 1,
    });
  };

  return (
    <>
      {deliveries && (
        <div>
          {deliveries.length === 0 ? (
            <EmptyList icon={<HookDeliveryIcon />} title="No sites" />
          ) : (
            <ul className="list-group">
              {deliveries.map((hookDelivery) => (
                <HookDeliveryView
                  delivery={hookDelivery}
                  key={hookDelivery._id}
                />
              ))}
            </ul>
          )}
          {loading && <Loader />}
          {error && <AlertError error={error} />}
          {hasMore && (
            <div className="d-flex justify-content-center mt-4">
              <LoadMore
                onClick={nextPage}
                disabled={loading}
                loading={loading}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
