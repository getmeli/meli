import React, { useEffect, useState } from 'react';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEnv } from '../../../providers/EnvProvider';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { axios } from '../../../providers/axios';
import { Loader } from '../../../commons/components/Loader';
import { AlertError } from '../../../commons/components/AlertError';
import { Toggle } from '../../../commons/components/forms/Toggle';
import { HttpMethodBadge } from './HttpMethodBadge';
import styles from './ApiScopes.module.scss';
import { ApiEndpoint } from './api-endpoint';
import { apiScopeGroups } from './api-scope-groups';
import { ApiScope } from './api-scope';
import { Tooltip, tooltipToggle } from '../../../commons/components/Tooltip';

interface EndpointGroup {
  group: string;
  endpoints: ApiEndpoint[];
}

function buildGroups(endpoints: ApiEndpoint[]): EndpointGroup[] {
  return Object
    .entries(apiScopeGroups)
    .map(([group, scopes]) => ({
      group,
      endpoints: scopes.flatMap(scope => endpoints.filter(({ apiScope }) => apiScope === scope)),
    }));
}

export function ApiScopes({
  value,
  onChange,
}: {
  value: ApiScope[];
  onChange: (scopes: ApiScope[]) => void;
}) {
  const env = useEnv();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [groups, setGroups] = useState<EndpointGroup[]>();

  useEffect(() => {
    setLoading(true);
    axios
      .get<ApiEndpoint[]>(`${env.MELI_API_URL}/api/v1/api-endpoints`)
      .then(({ data }) => buildGroups(data))
      .then(setGroups)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, setLoading]);

  const toggle = (isOn: boolean, scopes: ApiScope[]) => {
    if (isOn) {
      onChange([...(value || []), ...scopes.filter(scope => !value.includes(scope))]);
    } else {
      onChange(value.filter(scope => !scopes.includes(scope)));
    }
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <ul className="list-group">
      {groups.map(({ group, endpoints }) => (
        <div key={group}>
          <Toggle
            className="list-group-item d-flex justify-content-between"
            key={group}
            value={endpoints.every(({ apiScope }) => !!value?.includes(apiScope))}
            onChange={isOn => toggle(isOn, endpoints.map(({ apiScope }) => apiScope))}
          >
            <strong>{group}</strong>
          </Toggle>
          {endpoints.map(endpoint => {
            const id = `${endpoint.method}-${endpoint.path}`;
            return (
              <Toggle
                className="list-group-item d-flex bg-light"
                disabled={!endpoint.apiScope}
                key={id}
                value={value?.includes(endpoint.apiScope)}
                onChange={isOn => toggle(isOn, [endpoint.apiScope])}
              >
                <div className="d-flex justify-content-between align-items-center flex-grow-1">
                  <div className="d-flex align-items-center">
                    <div className={styles.method}>
                      <HttpMethodBadge method={endpoint.method} className="mr-3" />
                    </div>
                    <div className="mr-3">
                      <FontAwesomeIcon icon={faLock} fixedWidth {...tooltipToggle(id)} />
                      <Tooltip id={`${id}-auth-tooltip`}>
                        endpoint protected by authentication
                      </Tooltip>
                    </div>
                    <span>{endpoint.path}</span>
                  </div>
                  <div className="badge badge-primary ml-2" key={endpoint.apiScope}>
                    {endpoint.apiScope}
                  </div>
                </div>
              </Toggle>
            );
          })}
        </div>
      ))}
    </ul>
  );
}
