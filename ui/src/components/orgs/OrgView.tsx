import React, { createContext, useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { useEnv } from '../../providers/EnvProvider';
import { SubHeader } from '../SubHeader';
import { NotFound } from '../../commons/components/NotFound';
import { NavPills } from '../../commons/components/NavPills';
import { Bubble } from '../../commons/components/Bubble';
import { SettingsIcon } from '../icons/SettingsIcon';
import { OrgMemberIcon } from '../icons/OrgMemberIcon';
import { axios } from '../../providers/axios';
import { Org } from './org';
import { useCurrentOrg } from '../../providers/OrgProvider';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { Staff } from './staff/Staff';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { OrgSettings } from './settings/OrgSettings';

interface OrgContext {
  org: Org;
  setOrg: (org: Org) => void;
}

const Context = createContext<OrgContext>(undefined);
export const useOrg = () => useContext(Context);

export function OrgView() {
  // const [uid] = useState(uniqueId());
  const { url, path } = useRouteMatch();
  const { currentOrg: { org: { _id: currentOrgId } } } = useCurrentOrg();
  const [org, setOrg] = useState<Org>();

  const env = useEnv();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Org>(`${env.MELI_API_URL}/api/v1/orgs/${currentOrgId}`)
      .then(({ data }) => data)
      .then(setOrg)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, currentOrgId, setLoading]);

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <div className="container">
      <div className="row">
        <div className="col">
          <SubHeader className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <Bubble color={org.color} src={org.logo} />
                <span className="ml-2">{org.name}</span>
              </h5>
            </div>
            <div className="d-flex align-items-center">
              <NavPills links={[
                {
                  to: `${url}/settings`,
                  label: (
                    <>
                      <SettingsIcon className="mr-2" />
                      {' '}
                      Settings
                    </>
                  ),
                },
                {
                  to: `${url}/staff`,
                  label: (
                    <>
                      <OrgMemberIcon className="mr-2" />
                      {' '}
                      Staff
                    </>
                  ),
                },
              ]}
              />
            </div>
          </SubHeader>

          <div className="mt-4">
            <Context.Provider value={{
              org, setOrg,
            }}
            >
              <Switch>
                <Route path={path} exact component={() => <Redirect to={`${url}/settings`} />} />
                <Route path={`${path}/staff`} exact component={Staff} />
                <Route path={`${path}/settings`} exact component={OrgSettings} />
                <Route component={NotFound} />
              </Switch>
            </Context.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
