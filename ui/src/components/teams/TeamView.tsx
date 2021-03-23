import React, { createContext, useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { uniqueId } from 'lodash';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import { Team } from './team';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { Dropdown, dropdownToggle } from '../../commons/components/dropdown/Dropdown';
import { DropdownLink } from '../../commons/components/dropdown/DropdownLink';
import { SubHeader } from '../SubHeader';
import { NotFound } from '../../commons/components/NotFound';
import { NavPills } from '../../commons/components/NavPills';
import { DeleteTeam } from './DeleteTeam';
import { Bubble } from '../../commons/components/Bubble';
import { SettingsIcon } from '../icons/SettingsIcon';
import { ButtonIcon } from '../../commons/components/ButtonIcon';
import { SiteIcon } from '../icons/SiteIcon';
import { TeamMemberIcon } from '../icons/TeamMemberIcon';
import { SiteList } from '../sites/SiteList';
import { Members } from './members/Members';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { TeamSettings } from './settings/TeamSettings';

interface TeamContext {
  team: Team;
  setTeam: (team: Team) => void;
}

const Context = createContext<TeamContext>(undefined);
export const useTeam = () => useContext(Context);

export function TeamView() {
  const { url, path } = useRouteMatch();
  const { teamId } = useParams();
  const [uid] = useState(uniqueId());

  const env = useEnv();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [team, setTeam] = useState<Team>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Team>(`${env.MELI_API_URL}/api/v1/teams/${teamId}`)
      .then(({ data }) => data)
      .then(setTeam)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, teamId, setLoading]);

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <Context.Provider value={{
      team, setTeam,
    }}
    >
      <div className="container">
        <div className="row">
          <div className="col">
            <SubHeader className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <h5 className="mb-0 d-flex align-items-center">
                  <Bubble color={team.color} src={team.logo} />
                  <span className="ml-2">{team.name}</span>
                </h5>
              </div>
              <div className="d-flex align-items-center">
                <NavPills links={[
                  {
                    to: `${url}/sites`,
                    label: (
                      <>
                        <SiteIcon className="mr-2" />
                        {' '}
                        Sites
                      </>
                    ),
                  },
                  {
                    to: `${url}/members`,
                    label: (
                      <>
                        <TeamMemberIcon className="mr-2" />
                        {' '}
                        Members
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
                  <DeleteTeam id={teamId}>
                    <DropdownLink icon={<FontAwesomeIcon icon={faTrashAlt} fixedWidth />}>
                      Delete
                    </DropdownLink>
                  </DeleteTeam>
                </Dropdown>
              </div>
            </SubHeader>

            <div className="mt-4">
              <Switch>
                <Route path={path} exact component={() => <Redirect to={`${url}/sites`} />} />
                <Route path={`${path}/sites`} exact component={SiteList} />
                <Route path={`${path}/members`} exact component={Members} />
                <Route path={`${path}/settings`} exact component={TeamSettings} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </Context.Provider>
  );
}
