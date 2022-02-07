import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { uniqueId } from 'lodash';
import { Loader } from '../../commons/components/Loader';
import { EmptyList } from '../../commons/components/EmptyList';
import { AlertError } from '../../commons/components/AlertError';
import { Project } from './project';
import { PaginationData } from '../../commons/components/Pagination';
import { LoadMore } from '../../commons/components/LoadMore';
import { axios } from '../../providers/axios';
import { ProjectIcon } from '../icons/ProjectIcon';
import { Bubble } from '../../commons/components/Bubble';
import { FromNow } from '../../commons/components/FromNow';
import { AddProject } from './AddProject';
import { useCurrentOrg } from '../../providers/OrgProvider';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { useRoom } from '../../websockets/use-room';
import { EventType } from '../../websockets/event-type';
import { Org } from '../orgs/org';
import { extractErrorMessage } from '../../utils/extract-error-message';

export function ProjectList() {
  const { currentOrg } = useCurrentOrg();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [items, setItems] = useState<Project[]>();
  const itemsRef = useRef<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationData>();

  useRoom<{ org: Org; project: Project }>('org', currentOrg.org._id, [EventType.project_added], ({ project }) => {
    if (project.orgId === currentOrg.org._id) {
      setItems([project, ...items]);
    }
  });

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Project[]>(`/api/v1/orgs/${currentOrg.org._id}/projects`)
      .then(({ data }) => {
        itemsRef.current.push(...data);
        setItems(itemsRef.current);
      })
      .catch(setError)
      .catch(err => toast.error(`Could not list repositories: ${extractErrorMessage(err)}`))
      .finally(() => setLoading(false));
  }, [pagination, currentOrg, setLoading]);

  const nextPage = () => {
    setPagination({
      ...pagination,
      page: pagination.page + 1,
    });
  };

  const emptyList = (
    <EmptyList
      icon={<ProjectIcon/>}
      title="No projects"
    >
      <AddProject>
        <button type="button" className="btn btn-primary d-block">
          Add project
        </button>
      </AddProject>
    </EmptyList>
  );

  return loading ? (
    <Loader/>
  ) : error ? (
    <AlertError error={error}/>
  ) : (
    <div className="mt-5" key={uniqueId()}>
      {items.length === 0 ? (
        emptyList
      ) : (
        <>
          <h2>Projects</h2>
          <ul className="list-group">
            {items.map(project => (
              <Link to={`/projects/${project._id}`} className="d-block" key={project._id}>
                <li className="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Bubble color={project.color} src={project.logo}/>
                    <span className="ml-2">{project.name}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FromNow date={project.createdAt} label="Created"/>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </>
      )}
      {pagination && (
        <LoadMore
          onClick={nextPage}
          loading={loading}
          disabled={loading}
        />
      )}
    </div>
  );
}
