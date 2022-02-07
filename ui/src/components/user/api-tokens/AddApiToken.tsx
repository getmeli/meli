import React from 'react';
import { toast } from 'react-toastify';
import { axios } from '../../../providers/axios';
import { ApiToken } from './api-token';
import { ApiTokenForm, ApiTokenFormData } from './ApiTokenForm';
import { routerHistory } from '../../../providers/history';
import { extractErrorMessage } from '../../../utils/extract-error-message';

export function AddApiToken() {
  const onChange = (data: ApiTokenFormData): Promise<void> => axios
    .post<ApiToken>(`/api/v1/api-tokens`, {
      name: data.name,
      activesAt: data.activePeriod.from,
      expiresAt: data.activePeriod.to,
      scopes: data.scopes,
    })
    .then(() => {
      routerHistory.push('/user/api-tokens');
    })
    .catch(err => {
      toast.error(`Could not create api token: ${extractErrorMessage(err)}`);
    });
  return (
    <ApiTokenForm onChange={onChange}/>
  );
}
