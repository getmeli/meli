import React from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { axios } from '../../../../providers/axios';
import { Loader } from '../../../../commons/components/Loader';
import { OrgMember } from '../../../orgs/staff/members/org-member';
import { useMountedState } from '../../../../commons/hooks/use-mounted-state';
import { ProjectMember } from '../project-member';

export function ListItem({
  projectId, member, onAdded,
}: {
  projectId: string;
  member: OrgMember;
  onAdded: (projectMember: ProjectMember) => void;
}) {
  const [loading, setLoading] = useMountedState(false);

  const select = () => {
    setLoading(true);
    return axios
      .put<ProjectMember>(`/api/v1/projects/${projectId}/members/${member._id}`, {
        member: member._id,
      })
      .then(({ data }) => {
        onAdded(data);
      })
      .catch(err => {
        toast.error(`Could not select branch: ${err}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      className={classNames(
        'list-group-item list-group-item-action d-flex justify-content-between align-items-center bg-light',
      )}
      onClick={() => select()}
    >
      <strong>{member.name}</strong>
      <div>
        {loading && (
          <Loader/>
        )}
      </div>
    </div>
  );
}
