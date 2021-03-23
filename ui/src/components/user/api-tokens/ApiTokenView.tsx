import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { uniqueId } from 'lodash';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { axios } from '../../../providers/axios';
import { useEnv } from '../../../providers/EnvProvider';
import { ApiToken } from './api-token';
import { ApiTokenForm, ApiTokenFormData } from './ApiTokenForm';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { Loader } from '../../../commons/components/Loader';
import { AlertError } from '../../../commons/components/AlertError';
import { ButtonIcon } from '../../../commons/components/ButtonIcon';
import { Dropdown, dropdownToggle } from '../../../commons/components/dropdown/Dropdown';
import { DropdownLink } from '../../../commons/components/dropdown/DropdownLink';
import { SubHeader } from '../../SubHeader';
import { DeleteApiToken } from './DeleteApiToken';
import { routerHistory } from '../../../providers/history';
import { ApiTokenActivationPeriod } from './ApiTokenActivationPeriod';
import { CopyToClipboard } from '../../../commons/components/CopyToClipboard';
import { routeUp } from '../../../commons/utils/route-up';

export function ApiTokenView() {
  const { apiTokenId } = useParams();
  const [uid] = useState(uniqueId());
  const { url } = useRouteMatch();

  const env = useEnv();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [apiToken, setApiToken] = useState<ApiToken>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get(`${env.MELI_API_URL}/api/v1/api-tokens/${apiTokenId}`)
      .then(({ data }) => data)
      .then(setApiToken)
      .catch(setError)
      .catch(err => toast.error(`Could not get api token: ${err}`))
      .finally(() => setLoading(false));
  }, [env, setLoading, apiTokenId]);

  const onChange = useCallback(
    (formData: ApiTokenFormData): Promise<void> => axios
      .put<ApiToken>(`${env.MELI_API_URL}/api/v1/api-tokens/${apiTokenId}`, {
        name: formData.name,
        activatesAt: formData.activePeriod.from,
        expiresAt: formData.activePeriod.to,
        scopes: formData.scopes,
      })
      .then(({ data }) => setApiToken(data))
      .catch(err => {
        toast.error(`Could not update api token: ${err}`);
      }),
    [env, apiTokenId],
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
          <h5 className="mb-0 d-flex align-items-center">
            {apiToken.name}
          </h5>
        </div>
        <div className="d-flex align-items-center">
          <ApiTokenActivationPeriod apiToken={apiToken} />
          <ButtonIcon className="ml-3" {...dropdownToggle(uid)}>
            <FontAwesomeIcon icon={faEllipsisV} />
          </ButtonIcon>
          <Dropdown id={uid}>
            <DeleteApiToken tokenId={apiTokenId} onDelete={onDelete}>
              <DropdownLink icon={<FontAwesomeIcon icon={faTrashAlt} fixedWidth />}>
                Delete
              </DropdownLink>
            </DeleteApiToken>
          </Dropdown>
        </div>
      </SubHeader>

      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between no-border">
          <strong>Value</strong>
          <CopyToClipboard value={apiToken.value} blur className="text-center">
            <code>{apiToken.value}</code>
          </CopyToClipboard>
        </div>
      </div>

      <ApiTokenForm
        value={{
          name: apiToken.name,
          scopes: apiToken.scopes,
          activePeriod: {
            from: apiToken.activatesAt || undefined,
            to: apiToken.expiresAt || undefined,
          },
        }}
        onChange={onChange}
      />
    </>
  );
}
