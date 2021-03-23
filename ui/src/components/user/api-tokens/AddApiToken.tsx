import React, { useCallback } from 'react';
import { toast } from 'react-toastify';
import { axios } from '../../../providers/axios';
import { useEnv } from '../../../providers/EnvProvider';
import { ApiToken } from './api-token';
import { ApiTokenForm, ApiTokenFormData } from './ApiTokenForm';
import { routerHistory } from '../../../providers/history';

export function AddApiToken() {
  const env = useEnv();
  const onChange = useCallback(
    (data: ApiTokenFormData): Promise<void> => axios
      .post<ApiToken>(`${env.MELI_API_URL}/api/v1/api-tokens`, {
        name: data.name,
        activesAt: data.activePeriod.from,
        expiresAt: data.activePeriod.to,
        scopes: data.scopes,
      })
      .then(() => {
        routerHistory.push('/user/api-tokens');
      })
      .catch(err => {
        toast.error(`Could not create api token: ${err}`);
      }),
    [env],
  );
  return (
    <ApiTokenForm onChange={onChange} />
  );
}
