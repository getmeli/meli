import React, { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useRouteMatch } from 'react-router-dom';
import { Hook, HookType } from './hook';
import { routerHistory } from '../../providers/history';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import { HookForm } from './form/HookForm';
import { useHookContext } from './HookProvider';
import { routeUp } from '../../commons/utils/route-up';

export function AddHook() {
  const { context } = useHookContext();
  const { url } = useRouteMatch();
  const env = useEnv();
  const onChange = useCallback(
    (data: Hook): Promise<void> => axios
      .post<Hook>(`${env.MELI_API_URL}/api/v1/${context}/hooks`, data)
      .then(() => {
        routerHistory.push(routeUp(url));
      })
      .catch(err => {
        toast.error(`Could not create hook: ${err}`);
      }),
    [env, context, url],
  );
  return (
    <HookForm
      value={{
        type: HookType.web,
      } as any}
      onChange={onChange}
    />
  );
}
