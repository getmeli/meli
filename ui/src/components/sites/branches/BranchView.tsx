import React, { createContext, useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faExternalLinkAlt, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { uniqueId } from 'lodash';
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { Branch } from './branch';
import { DeleteBranch } from './DeleteBranch';
import { RenameBranch } from './RenameBranch';
import { Dropdown, dropdownToggle } from '../../../commons/components/dropdown/Dropdown';
import { DropdownLink } from '../../../commons/components/dropdown/DropdownLink';
import DropdownSeparator from '../../../commons/components/dropdown/DropdownSeparator';
import { ButtonIcon } from '../../../commons/components/ButtonIcon';
import { useSite } from '../SiteView';
import { Tooltip, tooltipToggle } from '../../../commons/components/Tooltip';
import { useEnv } from '../../../providers/EnvProvider';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { axios } from '../../../providers/axios';
import { Loader } from '../../../commons/components/Loader';
import { AlertError } from '../../../commons/components/AlertError';
import { ExternalLink } from '../../../commons/components/ExternalLink';
import { BranchRedirects } from './redirects/BranchRedirects';
import { NotFound } from '../../../commons/components/NotFound';
import { Releases } from '../releases/Releases';
import { SubHeader } from '../../SubHeader';
import { NavPills } from '../../../commons/components/NavPills';
import { SettingsIcon } from '../../icons/SettingsIcon';
import { ReleaseIcon } from '../../icons/ReleaseIcon';
import { RedirectIcon } from '../../icons/RedirectIcon';
import { routerHistory } from '../../../providers/history';
import { routeUp } from '../../../commons/utils/route-up';
import { BranchRelease } from './BranchRelease';
import { BranchSettings } from './settings/BranchSettings';
import { BranchIcon } from '../../icons/BranchIcon';
import { HeaderIcon } from '../../icons/HeaderIcon';
import { BranchHeaders } from './headers/BranchHeaders';
import { Forms } from './forms/Forms';

function useSiteBranch(siteId: string, branchId: string) {
  const env = useEnv();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [branch, setBranch] = useState<Branch>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Branch>(`${env.MELI_API_URL}/api/v1/sites/${siteId}/branches/${branchId}`)
      .then(({ data }) => data)
      .then(setBranch)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, setLoading, siteId, branchId]);

  return {
    branch,
    setBranch,
    error,
    loading,
  };
}

interface BranchContext {
  branch: Branch;
  setBranch: (chan: Branch) => void;
}

const Context = createContext<BranchContext>(undefined);
export const useBranch = () => useContext(Context);

export function BranchView() {
  const { siteId, branchId } = useParams();
  const { path, url } = useRouteMatch();
  const { site } = useSite();
  const [uid] = useState(uniqueId());
  const [uid1] = useState(uniqueId());
  const [current, setCurrent] = useState(false);
  const {
    branch, setBranch, loading, error,
  } = useSiteBranch(siteId, branchId);

  useEffect(() => {
    if (site && branch) {
      setCurrent(site.mainBranch === branch._id);
    }
  }, [site, branch]);

  const onDelete = () => {
    routerHistory.push(routeUp(url));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <Context.Provider value={{
      branch, setBranch,
    }}
    >
      <SubHeader className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <h5 className="mb-0 d-flex align-items-center">
            <BranchIcon className="mr-2" />
            <strong>{branch.name}</strong>
          </h5>
          {current && (
            <>
              <div
                className="badge badge-success ml-3"
                {...tooltipToggle(uid1)}
              >
                main
              </div>
              <Tooltip id={uid1}>Site main branch</Tooltip>
            </>
          )}
          {branch.release && (
            <BranchRelease releaseId={branch.release} />
          )}
          <ExternalLink href={branch.url} className="ml-3">
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </ExternalLink>
        </div>
        <div className="d-flex align-items-center">
          <NavPills links={[
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
              to: `${url}/redirects`,
              label: (
                <>
                  <RedirectIcon className="mr-2" />
                  {' '}
                  Redirects
                </>
              ),
            },
            {
              to: `${url}/headers`,
              label: (
                <>
                  <HeaderIcon className="mr-2" />
                  {' '}
                  Headers
                </>
              ),
            },
            {
              to: `${url}/forms`,
              label: (
                <>
                  <HeaderIcon className="mr-2" />
                  {' '}
                  Forms
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
          <ButtonIcon className="ml-2" {...dropdownToggle(uid)}>
            <FontAwesomeIcon icon={faEllipsisV} />
          </ButtonIcon>
          <Dropdown id={uid}>
            <RenameBranch siteId={siteId} branchId={branch._id} onRenamed={setBranch}>
              <DropdownLink icon={<FontAwesomeIcon icon={faPencilAlt} />}>
                Rename
              </DropdownLink>
            </RenameBranch>
            <DropdownSeparator />
            <DeleteBranch siteId={siteId} branchId={branch._id} onDelete={onDelete}>
              <DropdownLink icon={<FontAwesomeIcon icon={faTimes} />}>
                Delete
              </DropdownLink>
            </DeleteBranch>
          </Dropdown>
        </div>
      </SubHeader>

      <div className="mt-4">
        <Switch>
          <Route path={path} exact component={() => <Redirect to={`${url}/releases`} />} />
          <Route path={`${path}/releases`} exact component={Releases} />
          <Route path={`${path}/redirects`} exact component={BranchRedirects} />
          <Route path={`${path}/settings`} exact component={BranchSettings} />
          <Route path={`${path}/headers`} exact component={BranchHeaders} />
          <Route path={`${path}/forms`} exact component={Forms} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Context.Provider>
  );
}
