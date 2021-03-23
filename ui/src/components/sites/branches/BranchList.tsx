import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { EmptyList } from '../../../commons/components/EmptyList';
import { Loader } from '../../../commons/components/Loader';
import { AlertError } from '../../../commons/components/AlertError';
import { useEnv } from '../../../providers/EnvProvider';
import { axios } from '../../../providers/axios';
import styles from './BranchList.module.scss';
import { BranchIcon } from '../../icons/BranchIcon';
import { AddBranch } from './AddBranch';
import { Branch } from './branch';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { BranchListItemView } from './BranchListItem';

function sortBranches(a: Branch, b: Branch): number {
  return new Date(b.name).getTime() - new Date(a.name).getTime();
}

export function BranchList() {
  const env = useEnv();
  const { siteId } = useParams();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [items, setItems] = useState<Branch[]>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios.get<Branch[]>(`${env.MELI_API_URL}/api/v1/sites/${siteId}/branches`)
      .then(({ data }) => setItems(data))
      .catch(setError)
      .catch(err => toast.error(`Could not list branches: ${err}`))
      .finally(() => setLoading(false));
  }, [env, siteId, setLoading]);

  const onAdded = branch => {
    setItems([branch, ...items].sort(sortBranches));
  };

  const emptyList = (
    <EmptyList
      icon={<BranchIcon />}
      title="No branches"
    >
      <p>There are no branches yet</p>
      <AddBranch siteId={siteId} onAdded={onAdded}>
        <button type="button" className="btn btn-primary">
          Add branch
        </button>
      </AddBranch>
    </EmptyList>
  );

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <>
      {items.length === 0 ? (
        emptyList
      ) : (
        <div>
          <AddBranch
            siteId={siteId}
            onAdded={onAdded}
            className={classNames('list-group-item list-group-item-action', styles.add)}
          >
            Add branch
          </AddBranch>
          {items.map(branch => (
            <BranchListItemView
              key={branch._id}
              branch={branch}
            />
          ))}
        </div>
      )}
    </>
  );
}
