import React, { useCallback } from "react";
import { toast } from "react-toastify";
import { useRouteMatch } from "react-router-dom";
import { Hook, HookType } from "./hook";
import { routerHistory } from "../../providers/history";
import { axios } from "../../providers/axios";
import { HookForm } from "./form/HookForm";
import { useHookContext } from "./HookProvider";
import { routeUp } from "../../commons/utils/route-up";
import { extractErrorMessage } from "../../utils/extract-error-message";

export function AddHook() {
  const { context } = useHookContext();
  const { url } = useRouteMatch();
  const onChange = useCallback(
    (data: Hook): Promise<void> =>
      axios
        .post<Hook>(`/api/v1/${context}/hooks`, data)
        .then(() => {
          routerHistory.push(routeUp(url));
        })
        .catch((err) => {
          toast.error(`Could not create hook: ${extractErrorMessage(err)}`);
        }),
    [context, url]
  );
  return (
    <HookForm
      value={
        {
          type: HookType.web,
        } as any
      }
      onChange={onChange}
    />
  );
}
