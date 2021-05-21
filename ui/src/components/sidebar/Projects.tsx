import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { Project } from '../projects/project';
import styles from './Projects.module.scss';
import { Bubble } from '../../commons/components/Bubble';
import { axios } from '../../providers/axios';
import { AddSite } from '../sites/AddSite';
import { ButtonIcon } from '../../commons/components/ButtonIcon';
import { Sites } from './Sites';
import { useCurrentOrg } from '../../providers/OrgProvider';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { useRoom } from '../../websockets/use-room';
import { EventType } from '../../websockets/event-type';

function sortProjects(a: Project, b: Project) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function ProjectSection({ project, className, onDelete }: { project: Project; className?; onDelete: () => void }) {
  useRoom<{ project: Project }>('project', project._id, [EventType.project_deleted], ({ project: deletedProject }) => {
    if (project._id === deletedProject._id) {
      onDelete();
    }
  });

  return (
    <div className={className}>
      <div className={styles.linkHeader}>
        <NavLink
          className="d-flex align-items-center"
          to={`/projects/${project._id}`}
          activeClassName={styles.active}
        >
          <Bubble color={project.color} src={project.logo}/>
          <span className="ml-2 text-uppercase">{project.name}</span>
        </NavLink>
        <div>
          <AddSite projectId={project._id}>
            <ButtonIcon>
              <FontAwesomeIcon icon={faPlus}/>
            </ButtonIcon>
          </AddSite>
        </div>
      </div>
      <Sites projectId={project._id}/>
    </div>
  );
}

export function Projects({ className }: { className? }) {
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [projects, setProjects] = useState<Project[]>();
  const projectsRef = useRef<Project[]>([]);
  const { currentOrg } = useCurrentOrg();

  useRoom<{ project: Project }>('org', currentOrg.org._id, [EventType.project_added], ({ project }) => {
    if (project.orgId === currentOrg.org._id) {
      setProjects([project, ...projects]);
    }
  });

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Project[]>(`/api/v1/orgs/${currentOrg.org._id}/projects`)
      .then(({ data }) => {
        projectsRef.current = data;
        setProjects(projectsRef.current.sort(sortProjects));
      })
      .catch(setError)
      .catch(err => toast.error(`Could not list projects: ${err}`))
      .finally(() => setLoading(false));
  }, [currentOrg, setLoading]);

  const onProjectDeleted = (project: Project) => {
    setProjects(projects.filter(({ _id }) => _id !== project._id));
  };

  return loading ? (
    <Loader/>
  ) : error ? (
    <AlertError error={error}/>
  ) : (
    <div className={className}>
      {projects.length === 0 ? (
        <>
          No projects to show
        </>
      ) : (
        <>
          {projects.map(project => (
            <ProjectSection
              project={project}
              key={project._id}
              onDelete={() => onProjectDeleted(project)}
              className="mb-3"
            />
          ))}
        </>
      )}
    </div>
  );
}
