import React, { createContext, useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { uniqueId } from 'lodash';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { axios } from '../../providers/axios';
import { Project } from './project';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { Dropdown, dropdownToggle } from '../../commons/components/dropdown/Dropdown';
import { DropdownLink } from '../../commons/components/dropdown/DropdownLink';
import { SubHeader } from '../SubHeader';
import { NotFound } from '../../commons/components/NotFound';
import { NavPills } from '../../commons/components/NavPills';
import { DeleteProject } from './DeleteProject';
import { Bubble } from '../../commons/components/Bubble';
import { SettingsIcon } from '../icons/SettingsIcon';
import { ButtonIcon } from '../../commons/components/ButtonIcon';
import { SiteIcon } from '../icons/SiteIcon';
import { ProjectMemberIcon } from '../icons/ProjectMemberIcon';
import { SiteList } from '../sites/SiteList';
import { Members } from './members/Members';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { ProjectSettings } from './settings/ProjectSettings';

interface ProjectContext {
  project: Project;
  setProject: (project: Project) => void;
}

const Context = createContext<ProjectContext>(undefined);
export const useProject = () => useContext(Context);

export function ProjectView() {
  const { url, path } = useRouteMatch();
  const { projectId } = useParams<any>();
  const [uid] = useState(uniqueId());

  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Project>(`/api/v1/projects/${projectId}`)
      .then(({ data }) => data)
      .then(setProject)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [projectId, setLoading]);

  return loading ? (
    <Loader/>
  ) : error ? (
    <AlertError error={error}/>
  ) : (
    <Context.Provider value={{
      project, setProject,
    }}
    >
      <div className="container">
        <div className="row">
          <div className="col">
            <SubHeader className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <h5 className="mb-0 d-flex align-items-center">
                  <Bubble color={project.color} src={project.logo}/>
                  <span className="ml-2">{project.name}</span>
                </h5>
              </div>
              <div className="d-flex align-items-center">
                <NavPills links={[
                  {
                    to: `${url}/sites`,
                    label: (
                      <>
                        <SiteIcon className="mr-2"/>
                        {' '}
                        Sites
                      </>
                    ),
                  },
                  {
                    to: `${url}/members`,
                    label: (
                      <>
                        <ProjectMemberIcon className="mr-2"/>
                        {' '}
                        Members
                      </>
                    ),
                  },
                  {
                    to: `${url}/settings`,
                    label: (
                      <>
                        <SettingsIcon className="mr-2"/>
                        {' '}
                        Settings
                      </>
                    ),
                  },
                ]}
                />
                <ButtonIcon className="ml-3" {...dropdownToggle(uid)}>
                  <FontAwesomeIcon icon={faEllipsisV}/>
                </ButtonIcon>
                <Dropdown id={uid}>
                  <DeleteProject id={projectId}>
                    <DropdownLink icon={<FontAwesomeIcon icon={faTrashAlt} fixedWidth/>}>
                      Delete
                    </DropdownLink>
                  </DeleteProject>
                </Dropdown>
              </div>
            </SubHeader>

            <div className="mt-4">
              <Switch>
                <Route path={path} exact component={() => <Redirect to={`${url}/sites`}/>}/>
                <Route path={`${path}/sites`} exact component={SiteList}/>
                <Route path={`${path}/members`} exact component={Members}/>
                <Route path={`${path}/settings`} exact component={ProjectSettings}/>
                <Route component={NotFound}/>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </Context.Provider>
  );
}
