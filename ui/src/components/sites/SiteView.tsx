import React, { createContext, useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisV, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { uniqueId } from 'lodash';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import { Site } from './site';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { Dropdown, dropdownToggle } from '../../commons/components/dropdown/Dropdown';
import { DropdownLink } from '../../commons/components/dropdown/DropdownLink';
import { SubHeader } from '../SubHeader';
import { NotFound } from '../../commons/components/NotFound';
import { NavPills } from '../../commons/components/NavPills';
import { DeleteSite } from './DeleteSite';
import { ExternalLink } from '../../commons/components/ExternalLink';
import { Bubble } from '../../commons/components/Bubble';
import { TokenIcon } from '../icons/TokenIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { BranchIcon } from '../icons/BranchIcon';
import { ButtonIcon } from '../../commons/components/ButtonIcon';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { HookIcon } from '../icons/HookIcon';
import { HookProvider } from '../hooks/HookProvider';
import { Hooks } from '../hooks/Hooks';
import { Branches } from './branches/Branches';
import { Tokens } from './tokens/Tokens';
import { Releases } from './releases/Releases';
import { ReleaseIcon } from '../icons/ReleaseIcon';
import { SiteSettings } from './settings/SiteSettings';

interface SiteContext {
  site: Site;
  setSite: (site: Site) => void;
}

const Context = createContext<SiteContext>(undefined);
export const useSite = () => useContext(Context);

export function SiteView() {
  const { url, path } = useRouteMatch();
  const { siteId } = useParams();
  const [uid] = useState(uniqueId());

  const env = useEnv();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [site, setSite] = useState<Site>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Site>(`${env.MELI_API_URL}/api/v1/sites/${siteId}`)
      .then(({ data }) => data)
      .then(setSite)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, siteId, setLoading]);

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
                <Bubble color={site.color} src={site.logo} />
                <span className="ml-2">{site.name}</span>
              </h5>
              <ExternalLink href={site.url} className="ml-3">
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </ExternalLink>
            </div>
            <div className="d-flex align-items-center">
              <NavPills links={[
                {
                  to: `${url}/branches`,
                  label: (
                    <>
                      <BranchIcon className="mr-2" />
                      ️ Branches
                    </>
                  ),
                },
                {
                  to: `${url}/releases`,
                  label: (
                    <>
                      <ReleaseIcon className="mr-2" />
                      ️ Releases
                    </>
                  ),
                },
                {
                  to: `${url}/tokens`,
                  label: (
                    <>
                      <TokenIcon className="mr-2" />
                      {' '}
                      Tokens
                    </>
                  ),
                },
                {
                  to: `${url}/hooks`,
                  label: (
                    <>
                      <HookIcon className="mr-2" />
                      {' '}
                      Hooks
                    </>
                  ),
                },
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
              ]}
              />
              <ButtonIcon className="ml-3" {...dropdownToggle(uid)}>
                <FontAwesomeIcon icon={faEllipsisV} />
              </ButtonIcon>
              <Dropdown id={uid}>
                <DeleteSite id={siteId} teamId={site.teamId}>
                  <DropdownLink icon={<FontAwesomeIcon icon={faTrashAlt} fixedWidth />}>
                    Delete
                  </DropdownLink>
                </DeleteSite>
              </Dropdown>
            </div>
          </SubHeader>

          <div className="mt-4">
            <Context.Provider value={{
              site, setSite,
            }}
            >
              <Switch>
                <Route path={path} exact component={() => <Redirect to={`${url}/branches`} />} />
                <Route path={`${path}/branches`} component={Branches} />
                <Route path={`${path}/releases`} component={Releases} />
                <Route path={`${path}/tokens`} component={Tokens} />
                <Route
                  path={`${path}/hooks`}
                  component={() => (
                    <HookProvider context={`sites/${siteId}`}>
                      <Hooks />
                    </HookProvider>
                  )}
                />
                <Route path={`${path}/settings`} component={SiteSettings} />
                <Route component={NotFound} />
              </Switch>
            </Context.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
