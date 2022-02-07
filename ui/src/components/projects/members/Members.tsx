import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { EmptyList } from '../../../commons/components/EmptyList';
import { Loader } from '../../../commons/components/Loader';
import { AlertError } from '../../../commons/components/AlertError';
import { ProjectMember } from './project-member';
import { axios } from '../../../providers/axios';
import { AddMember } from './add/AddMember';
import { MemberView } from './MemberView';
import styles from './Members.module.scss';
import { ProjectMemberIcon } from '../../icons/ProjectMemberIcon';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { extractErrorMessage } from '../../../utils/extract-error-message';

function sortMembers(a: ProjectMember, b: ProjectMember): number {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

export function Members() {
  const { projectId } = useParams<any>();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [items, setItems] = useState<ProjectMember[]>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios.get(`/api/v1/projects/${projectId}/members`)
      .then(({ data }) => data)
      .then(setItems)
      .catch(setError)
      .catch(err => toast.error(`Could not list members: ${extractErrorMessage(err)}`))
      .finally(() => setLoading(false));
  }, [projectId, setLoading]);

  const onAdd = member => {
    setItems([member, ...items].sort(sortMembers));
  };

  const onDelete = (deletedMemberId: string) => {
    setItems(items.filter(({ memberId }) => memberId !== deletedMemberId));
  };

  const emptyList = (
    <EmptyList
      icon={<ProjectMemberIcon/>}
      title="No members"
    >
      <p>There are no members yet</p>
      <AddMember projectId={projectId} onAdded={onAdd}>
        <button type="button" className="btn btn-primary">
          Add member
        </button>
      </AddMember>
    </EmptyList>
  );

  return loading ? (
    <Loader/>
  ) : error ? (
    <AlertError error={error}/>
  ) : (
    <>
      {items.length === 0 ? (
        emptyList
      ) : (
        <div className="container">
          <ul className="list-group">
            <AddMember
              projectId={projectId}
              onAdded={onAdd}
              className={classNames('list-group-item', styles.add)}
            >
              Add member
            </AddMember>
            {items.map(member => (
              <MemberView
                key={member.memberId}
                projectId={projectId}
                member={member}
                onDelete={() => onDelete(member.memberId)}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
