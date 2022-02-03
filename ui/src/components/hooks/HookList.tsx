import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import classNames from "classnames";
import { Link, useRouteMatch } from "react-router-dom";
import styles from "./HookList.module.scss";
import { EmptyList } from "../../commons/components/EmptyList";
import { axios } from "../../providers/axios";
import { Loader } from "../../commons/components/Loader";
import { AlertError } from "../../commons/components/AlertError";
import { useMountedState } from "../../commons/hooks/use-mounted-state";
import { useHookContext } from "./HookProvider";
import { Hook } from "./hook";
import { HookIcon } from "../icons/HookIcon";
import { extractErrorMessage } from "../../utils/extract-error-message";

function sortHooks(a: Hook, b: Hook): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function HookList() {
  const { url } = useRouteMatch();
  const { context } = useHookContext();

  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [hooks, setHooks] = useState<Hook[]>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Hook[]>(`/api/v1/${context}/hooks`)
      .then(({ data }) => data.sort(sortHooks))
      .then(setHooks)
      .catch(setError)
      .catch((err) =>
        toast.error(`Could not list hooks: ${extractErrorMessage(err)}`)
      )
      .finally(() => setLoading(false));
  }, [setLoading, context]);

  const emptyList = (
    <EmptyList icon={<HookIcon />} title="No hooks">
      <p>There are no hooks yet</p>
      <Link to={`${url}/add`}>
        <button type="button" className="btn btn-primary">
          Add hook
        </button>
      </Link>
    </EmptyList>
  );

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <>
      {hooks.length === 0 ? (
        emptyList
      ) : (
        <ul className="list-group">
          <Link
            to={`${url}/add`}
            className={classNames(
              "list-group-item list-group-item-action",
              styles.add
            )}
          >
            Add hook
          </Link>
          {hooks.map((hook) => (
            <Link
              key={hook._id}
              to={`${url}/${hook._id}`}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <div className="flex-grow-1 d-flex align-items-center">
                {/* TODO status */}
                <code>{hook.type}</code>
                <strong className="mr-3">{hook.name}</strong>
              </div>
            </Link>
          ))}
        </ul>
      )}
    </>
  );
}
