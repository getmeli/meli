import React, { useCallback, useEffect, useState } from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { uniqueId } from "lodash";
import { Hook } from "./hook";
import { ButtonIcon } from "../../commons/components/ButtonIcon";
import { routerHistory } from "../../providers/history";
import {
  Dropdown,
  dropdownToggle,
} from "../../commons/components/dropdown/Dropdown";
import { Loader } from "../../commons/components/Loader";
import { DeleteHook } from "./DeleteHook";
import { DropdownLink } from "../../commons/components/dropdown/DropdownLink";
import { SubHeader } from "../SubHeader";
import { axios } from "../../providers/axios";
import { AlertError } from "../../commons/components/AlertError";
import { useMountedState } from "../../commons/hooks/use-mounted-state";
import { useHookContext } from "./HookProvider";
import { HookForm } from "./form/HookForm";
import { routeUp } from "../../commons/utils/route-up";
import { NavPills } from "../../commons/components/NavPills";
import { HookDeliveries } from "./deliveries/HookDeliveries";
import { NotFound } from "../../commons/components/NotFound";
import { extractErrorMessage } from "../../utils/extract-error-message";

export function HookView() {
  const { hookId } = useParams<any>();
  const [uid] = useState(uniqueId());
  const { url, path } = useRouteMatch();
  const { context } = useHookContext();

  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [hook, setHook] = useState<Hook>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Hook>(`/api/v1/${context}/hooks/${hookId}`)
      .then(({ data }) => setHook(data))
      .catch(setError)
      .catch((err) =>
        toast.error(`Could not get hook: ${extractErrorMessage(err)}`)
      )
      .finally(() => setLoading(false));
  }, [setLoading, hookId, context]);

  const onChange = useCallback(
    (formData: Hook): Promise<void> =>
      axios
        .put<Hook>(`/api/v1/${context}/hooks/${hookId}`, formData)
        .then(({ data }) => setHook(data)),
    [hookId, context]
  );

  const onDelete = () => {
    routerHistory.push(routeUp(url));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <>
      <SubHeader className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <code className="mr-2">{hook.type}</code>
          <h5 className="mb-0 d-flex align-items-center">{hook.name}</h5>
        </div>
        <div className="d-flex align-items-center">
          <NavPills
            links={[
              {
                to: url,
                label: "Settings",
                exact: true,
              },
              {
                to: `${url}/deliveries`,
                label: "Deliveries",
              },
            ]}
          />
          <ButtonIcon className="ml-3" {...dropdownToggle(uid)}>
            <FontAwesomeIcon icon={faEllipsisV} />
          </ButtonIcon>
          <Dropdown id={uid}>
            <DeleteHook hookId={hookId} onDelete={onDelete}>
              <DropdownLink
                icon={<FontAwesomeIcon icon={faTrashAlt} fixedWidth />}
              >
                Delete
              </DropdownLink>
            </DeleteHook>
          </Dropdown>
        </div>
      </SubHeader>

      <Switch>
        <Route
          path={path}
          exact
          component={() => <HookForm value={hook} onChange={onChange} />}
        />
        <Route path={`${path}/deliveries`} exact component={HookDeliveries} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}
